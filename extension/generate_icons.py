"""Generate default weather icons for the browser extension."""
from PIL import Image, ImageDraw
import os

SIZES = [16, 32, 48, 128]
ICONS_DIR = os.path.join(os.path.dirname(__file__), 'icons')

def generate_icon(size: int) -> Image.Image:
    """Generate a weather app icon with sun and cloud."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background - rounded rectangle (blue sky)
    radius = int(size * 0.15)
    draw.rounded_rectangle(
        [0, 0, size - 1, size - 1],
        radius=radius,
        fill=(79, 195, 247)  # Light blue
    )
    
    # Sun (yellow circle)
    sun_radius = int(size * 0.2)
    sun_x = int(size * 0.3)
    sun_y = int(size * 0.3)
    draw.ellipse(
        [sun_x - sun_radius, sun_y - sun_radius, 
         sun_x + sun_radius, sun_y + sun_radius],
        fill=(255, 213, 79)  # Yellow
    )
    
    # Cloud (white overlapping circles)
    cloud_y = int(size * 0.55)
    cloud_x = int(size * 0.55)
    cloud_r = int(size * 0.12)
    
    # Draw cloud circles
    for offset_x, offset_y, r_mult in [
        (0, 0, 1.0),
        (cloud_r * 0.7, -cloud_r * 0.3, 0.9),
        (cloud_r * 1.4, 0, 0.85),
        (cloud_r * 0.4, cloud_r * 0.3, 0.7),
        (cloud_r * 1.0, cloud_r * 0.3, 0.7),
    ]:
        r = int(cloud_r * r_mult)
        x = int(cloud_x + offset_x)
        y = int(cloud_y + offset_y)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255))
    
    return img

def main():
    os.makedirs(ICONS_DIR, exist_ok=True)
    
    for size in SIZES:
        icon = generate_icon(size)
        path = os.path.join(ICONS_DIR, f'default-{size}.png')
        icon.save(path, 'PNG')
        print(f'Generated: {path}')
    
    print('All icons generated successfully!')

if __name__ == '__main__':
    main()
