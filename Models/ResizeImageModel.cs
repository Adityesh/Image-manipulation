using Microsoft.AspNetCore.Http;

namespace image_search.Models {
    public class ResizeImageModel {

        public Filters Filters { get; set; }
        public string Extension { get; set; }
        public IFormFile Image {get; set;}
    }

    public class Filters {
        public float? Brightness { get; set; }
        public float? Opacity { get; set; }
        public float? Contrast { get; set; }
        public float? Grayscale { get; set; }
        public float? Sepia { get; set; }
        public int? Pixelate { get; set; }
        public float? Resolution { get; set; }


    }


}