#!/usr/bin/env python3
"""Extract dominant colors from a PNG image (pure Python, no Pillow)."""
import struct, zlib
from collections import Counter

def read_png_pixels(path):
    with open(path, 'rb') as f:
        data = f.read()

    pos = 8  # skip PNG signature
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

    # PNG filter type 0 (None) assumed for simplicity; handle Sub(1) too
    bpp = 3  # RGB
    stride = 1 + width * bpp
    recon = bytearray(width * height * bpp)

    for y in range(height):
        filter_byte = raw[y * stride]
        row_start_raw = y * stride + 1
        row_start_recon = y * width * bpp
        prev_row_start = (y - 1) * width * bpp if y > 0 else None

        for x in range(width * bpp):
            cur = raw[row_start_raw + x]
            a = recon[row_start_recon + x - bpp] if x >= bpp else 0
            b = recon[prev_row_start + x] if prev_row_start is not None else 0
            c = recon[prev_row_start + x - bpp] if (prev_row_start is not None and x >= bpp) else 0

            if filter_byte == 0:
                recon[row_start_recon + x] = cur
            elif filter_byte == 1:
                recon[row_start_recon + x] = (cur + a) & 0xFF
            elif filter_byte == 2:
                recon[row_start_recon + x] = (cur + b) & 0xFF
            elif filter_byte == 3:
                recon[row_start_recon + x] = (cur + (a + b) // 2) & 0xFF
            elif filter_byte == 4:
                # Paeth
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if pa <= pb and pa <= pc else (b if pb <= pc else c)
                recon[row_start_recon + x] = (cur + pr) & 0xFF

    pixels = []
    for i in range(0, len(recon), 3):
        pixels.append((recon[i], recon[i+1], recon[i+2]))

    return width, height, pixels


width, height, pixels = read_png_pixels('assets/color-samples.png')
c = Counter(pixels)
print(f'Image: {width}x{height}')
print(f'Top 20 colors:')
for color, count in c.most_common(20):
    pct = count / len(pixels) * 100
    hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f'  RGB{color} = {hex_color}  ({pct:.1f}%)')
