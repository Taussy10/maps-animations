import argparse
import sys

try:
    import vtracer
except ImportError:
    print("The 'vtracer' library is not installed.")
    print("Please install it by running: pip install vtracer")
    sys.exit(1)

def image_to_svg(input_image_path, output_svg_path):
    """
    Converts a raster image (JPG, PNG, etc.) to a vector SVG file.
    """
    print(f"Converting '{input_image_path}' to '{output_svg_path}'...")
    
    try:
        # vtracer provides a simple function to convert an image to an SVG.
        # You can customize parameters like colormode, hierarchical, mode, filter_speckle, etc.
        vtracer.convert_image_to_svg_py(
            input_image_path,
            output_svg_path,
            colormode='color',        # 'color' or 'binary'
            hierarchical='stacked',   # 'stacked' or 'cutout'
            mode='spline',            # 'spline', 'polygon', or 'none'
            filter_speckle=4,         # Ignore small details
            color_precision=6,        # Number of significant bits to use in an RGB channel
            layer_difference=16,      # Color difference between gradient layers
            corner_threshold=60,      # Minimum angle to be considered a corner
            length_threshold=4.0,     # Minimum length of a straight segment
            max_iterations=10,        # Maximum number of iterations for spline fitting
            splice_threshold=45,      # Angle threshold for splicing splines
            path_precision=8          # Decimal places for SVG path data
        )
        print("Conversion successful!")
    except Exception as e:
        print(f"An error occurred during conversion: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert an image to an SVG.")
    parser.add_argument("input", help="Path to the input image file (e.g., input.jpg, input.png)")
    parser.add_argument("output", help="Path to the output SVG file (e.g., output.svg)")
    
    args = parser.parse_args()
    
    image_to_svg(args.input, args.output)
