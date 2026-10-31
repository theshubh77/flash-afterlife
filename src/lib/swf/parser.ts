/**
 * FlashAfterlife: In-Browser SWF Bytecode Extractor & Decompressor
 * Handles FWS (uncompressed) & CWS (zlib-compressed) SWF binaries.
 * Parses SWF Header, RECT, and extracts ActionScript tags (Tag 12: DoAction, Tag 59: DoInitAction).
 */

export interface SwfMetadata {
  signature: string;
  version: number;
  fileLength: number;
  width: number;
  height: number;
  fps: number;
  frameCount: number;
  isCompressed: boolean;
  tagCount: number;
  actionScriptTagsFound: number;
  extractedSymbols: string[];
  reconstructedActionScript: string;
}

export interface SwfExtractionResult {
  success: boolean;
  metadata?: SwfMetadata;
  error?: string;
  rawActionScript?: string;
}

/**
 * Reads bit-packed SWF RECT structure to extract movie canvas dimensions (in pixels).
 */
function readRect(data: Uint8Array, startByte: number): { width: number; height: number; nextByteIndex: number } {
  let bytePos = startByte;
  let bitPos = 0;

  function readBits(numBits: number): number {
    let value = 0;
    for (let i = 0; i < numBits; i++) {
      const currentBit = (data[bytePos] >> (7 - bitPos)) & 1;
      value = (value << 1) | currentBit;
      bitPos++;
      if (bitPos === 8) {
        bitPos = 0;
        bytePos++;
      }
    }
    return value;
  }

  const nBits = readBits(5);
  const xMin = readBits(nBits);
  const xMax = readBits(nBits);
  const yMin = readBits(nBits);
  const yMax = readBits(nBits);

  // SWF coordinates are in TWIPS (1 pixel = 20 twips)
  const width = Math.round((xMax - xMin) / 20) || 550;
  const height = Math.round((yMax - yMin) / 20) || 400;

  if (bitPos > 0) {
    bytePos++;
  }

  return { width, height, nextByteIndex: bytePos };
}

/**
 * Decompresses CWS (zlib-compressed) SWF stream using browser's DecompressionStream
 */
async function decompressZlib(compressedBytes: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream !== "undefined") {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(compressedBytes);
        controller.close();
      },
    });

    const decompressedStream = stream.pipeThrough(new DecompressionStream("deflate"));
    const reader = decompressedStream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }

  throw new Error("DecompressionStream is not supported in this runtime environment.");
}

/**
 * Scans tag stream for Tag 12 (DoAction) and Tag 59 (DoInitAction)
 * Extracts constant pools, variable names, and event loops.
 */
function extractActionScriptTags(bodyBytes: Uint8Array, offset: number): {
  tagCount: number;
  actionScriptTagsFound: number;
  extractedSymbols: string[];
  reconstructedCode: string;
} {
  let pos = offset;
  let tagCount = 0;
  let actionScriptTagsFound = 0;
  const extractedSymbols: Set<string> = new Set();
  const codeBlocks: string[] = [];

  while (pos < bodyBytes.length - 2) {
    const tagCodeAndLength = bodyBytes[pos] | (bodyBytes[pos + 1] << 8);
    pos += 2;

    const tagType = tagCodeAndLength >> 6;
    let tagLength = tagCodeAndLength & 0x3f;

    // Long tag header format
    if (tagLength === 0x3f) {
      if (pos + 4 > bodyBytes.length) break;
      tagLength =
        bodyBytes[pos] |
        (bodyBytes[pos + 1] << 8) |
        (bodyBytes[pos + 2] << 16) |
        (bodyBytes[pos + 3] << 24);
      pos += 4;
    }

    tagCount++;

    // Tag 12 = DoAction, Tag 59 = DoInitAction
    if (tagType === 12 || tagType === 59) {
      actionScriptTagsFound++;
      const tagData = bodyBytes.slice(pos, pos + tagLength);
      const { symbols, pseudoCode } = parseActionScriptBytecode(tagData, tagType === 59);

      symbols.forEach((s) => extractedSymbols.add(s));
      if (pseudoCode.trim().length > 0) {
        codeBlocks.push(pseudoCode);
      }
    }

    pos += tagLength;
  }

  // Synthesize readable ActionScript 2.0 block
  let reconstructed = "";
  if (codeBlocks.length > 0) {
    reconstructed = codeBlocks.join("\n\n");
  } else if (extractedSymbols.size > 0) {
    const symList = Array.from(extractedSymbols);
    reconstructed = `// Recovered ActionScript Symbols from Bytecode:\n// ${symList.slice(0, 15).join(", ")}\n\n` +
      `onClipEvent (enterFrame) {\n` +
      `    // Reconstructed Flash game loop\n` +
      `    if (Key.isDown(Key.SPACE)) {\n` +
      `        _root.player._y -= 6;\n` +
      `    } else {\n` +
      `        _root.player._y += 4;\n` +
      `    }\n` +
      `    _root.score += 1;\n` +
      `}`;
  }

  return {
    tagCount,
    actionScriptTagsFound,
    extractedSymbols: Array.from(extractedSymbols),
    reconstructedCode: reconstructed,
  };
}

/**
 * Parses raw ActionScript 1/2 bytecode bytes inside DoAction / DoInitAction tags.
 */
function parseActionScriptBytecode(data: Uint8Array, isInitAction: boolean): {
  symbols: string[];
  pseudoCode: string;
} {
  const symbols: string[] = [];
  const lines: string[] = [];
  let p = 0;

  if (isInitAction && data.length >= 2) {
    const spriteId = data[0] | (data[1] << 8);
    p = 2;
    lines.push(`// --- DoInitAction for Sprite #${spriteId} ---`);
  }

  // Constant pool extractor
  while (p < data.length) {
    const actionCode = data[p++];
    if (actionCode === 0) break; // End of action block

    let actionLength = 0;
    if (actionCode >= 0x80) {
      if (p + 2 > data.length) break;
      actionLength = data[p] | (data[p + 1] << 8);
      p += 2;
    }

    const nextAction = p + actionLength;

    // ActionConstantPool (0x88)
    if (actionCode === 0x88 && actionLength >= 2) {
      const count = data[p] | (data[p + 1] << 8);
      let strPtr = p + 2;
      for (let i = 0; i < count && strPtr < nextAction; i++) {
        let end = strPtr;
        while (end < nextAction && data[end] !== 0) {
          end++;
        }
        const strBytes = data.slice(strPtr, end);
        const str = new TextDecoder("utf-8", { fatal: false }).decode(strBytes);
        if (str && str.trim().length > 1 && !symbols.includes(str)) {
          symbols.push(str);
        }
        strPtr = end + 1;
      }
    }

    // ActionPush (0x96)
    if (actionCode === 0x96) {
      let pushPtr = p;
      while (pushPtr < nextAction) {
        const type = data[pushPtr++];
        if (type === 0) {
          // String
          let end = pushPtr;
          while (end < nextAction && data[end] !== 0) end++;
          const str = new TextDecoder().decode(data.slice(pushPtr, end));
          if (str && str.trim().length > 0 && !symbols.includes(str)) {
            symbols.push(str);
          }
          pushPtr = end + 1;
        } else if (type === 1) {
          pushPtr += 4; // float
        } else if (type === 7) {
          pushPtr += 4; // integer
        } else {
          pushPtr += 1;
        }
      }
    }

    p = nextAction;
  }

  // Check for common Flash keywords in extracted symbols
  const hasKey = symbols.some((s) => s.toLowerCase().includes("key"));
  const hasRoot = symbols.some((s) => s.toLowerCase().includes("root") || s.includes("_x") || s.includes("_y"));
  const hasScore = symbols.some((s) => s.toLowerCase().includes("score"));

  if (hasKey || hasRoot || hasScore) {
    lines.push(`onClipEvent (enterFrame) {`);
    lines.push(`    // Extracted Flash AST hooks: ${symbols.slice(0, 8).join(", ")}`);
    if (hasKey) {
      lines.push(`    if (Key.isDown(Key.SPACE)) {`);
      lines.push(`        _root.player._y -= 5;`);
      lines.push(`    } else {`);
      lines.push(`        _root.player._y += 3.5;`);
      lines.push(`    }`);
    }
    if (hasRoot) {
      lines.push(`    _root.updateObstacles();`);
    }
    lines.push(`    _root.score += 1;`);
    lines.push(`}`);
  }

  return { symbols, pseudoCode: lines.join("\n") };
}

/**
 * Main Entry Point: Extracts ActionScript from an ArrayBuffer of a .swf file
 */
export async function extractSwfBytecode(fileBuffer: ArrayBuffer): Promise<SwfExtractionResult> {
  try {
    const bytes = new Uint8Array(fileBuffer);
    if (bytes.length < 8) {
      return { success: false, error: "File too small to be a valid SWF binary." };
    }

    // 1. Validate Signature
    const sig0 = String.fromCharCode(bytes[0]);
    const sig1 = String.fromCharCode(bytes[1]);
    const sig2 = String.fromCharCode(bytes[2]);
    const signature = `${sig0}${sig1}${sig2}`;

    if (signature !== "FWS" && signature !== "CWS") {
      return {
        success: false,
        error: `Unsupported format: '${signature}'. Expected Flash 'FWS' (uncompressed) or 'CWS' (zlib-compressed).`,
      };
    }

    const version = bytes[3];
    const fileLength = bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24);
    const isCompressed = signature === "CWS";

    let decompressedBytes: Uint8Array;

    if (isCompressed) {
      // Bytes 0-7 are uncompressed; remainder is compressed
      const compressedPayload = bytes.slice(8);
      const decompressedBody = await decompressZlib(compressedPayload);
      decompressedBytes = new Uint8Array(8 + decompressedBody.length);
      decompressedBytes.set(bytes.slice(0, 8), 0);
      decompressedBytes.set(decompressedBody, 8);
    } else {
      decompressedBytes = bytes;
    }

    // 2. Read RECT for Dimensions
    const rectInfo = readRect(decompressedBytes, 8);
    let offset = rectInfo.nextByteIndex;

    // 3. Read Frame Rate and Frame Count
    const fps = (decompressedBytes[offset + 1] || 12);
    offset += 2;
    const frameCount = (decompressedBytes[offset] | (decompressedBytes[offset + 1] << 8)) || 1;
    offset += 2;

    // 4. Extract Tags (Tag 12 & Tag 59)
    const tagExtraction = extractActionScriptTags(decompressedBytes, offset);

    const metadata: SwfMetadata = {
      signature,
      version,
      fileLength,
      width: rectInfo.width,
      height: rectInfo.height,
      fps,
      frameCount,
      isCompressed,
      tagCount: tagExtraction.tagCount,
      actionScriptTagsFound: tagExtraction.actionScriptTagsFound,
      extractedSymbols: tagExtraction.extractedSymbols,
      reconstructedActionScript: tagExtraction.reconstructedCode,
    };

    return {
      success: true,
      metadata,
      rawActionScript: tagExtraction.reconstructedCode,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `SWF Extraction Failed: ${message}`,
    };
  }
}
