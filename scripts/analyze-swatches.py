#!/usr/bin/env python3
"""Sample color swatches at regular horizontal intervals from the middle row."""
import struct, zlib

def read_png_pixels(path):
    with open(path, 'rb') as f:
        data = f.read()

    pos = 8
    width = height = 0
    idat_data = b''
    while pos < len(data):
        length = struct.unpack('>I', data[pos:pos+4])[0]
        chunk_type = data[pos+4:pos+8]
        chunk_data = data[pos+8:pos+8+length]
        if chunk_type == b'IHDR':
            width, height = struct.unpack('>II', chunk_data[:8])
        elif chunk_type == b'IDAT':
            idat_data += chunk_data
        pos += 12 + length

    raw = zlib.decompress(idat_data)
    bpp = 3
    stride = 1 + width * bpp
    recon = bytearray(width * height * bpp)

    for y in range(height):
        fb = raw[y * stride]
        rs = y * stride + 1
        rr = y * width * bpp
        pr = (y - 1) * width * bpp if y > 0 else None
        for x in range(width * bpp):
            cur = raw[rs + x]
            a = recon[rr + x - bpp] if x >= bpp else 0
            b = recon[pr + x] if pr is not None else 0
            c = recon[pr + x - bpp] if (pr is not None and x >= bpp) else 0
            if fb == 0: recon[rr + x] = cur
            elif fb == 1: recon[rr + x] = (cur + a) & 0xFF
            elif fb == 2: recon[rr + x] = (cur + b) & 0xFF
            elif fb == 3: recon[rr + x] = (cur + (a + b) // 2) & 0xFF
            elif fb == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr2 = a if pa <= pb and pa <= pc else (b if pb <= pc else c)
                recon[rr + x] = (cur + pr2) & 0xFF

    pixels = []
    for i in range(0, len(recon), 3):
        pixels.append((recon[i], recon[i+1], recon[i+2]))
    return width, height, pixels

width, height, pixels = read_png_pixels('assets/color-samples.png')

# Sample every 20px across the middle row to see discrete swatches
mid = height // 2
print(f'Image: {width}x{height}, sampling row {mid}:')
print()
prev = None
swatch_num = 0
for x in range(0, width, 5):
    color = pixels[mid * width + x]
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    # Detect swatch boundaries (color change > threshold)
    if prev is None or sum(abs(a - b) for a, b in zip(color, prev)) > 30:
        swatch_num += 1
        print(f'  Swatch {swatch_num} at x={x}: RGB{color} = {hex_c}')
    prev = color
