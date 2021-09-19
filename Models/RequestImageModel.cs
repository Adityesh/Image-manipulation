using Microsoft.AspNetCore.Http;

namespace image_search.Models {
    public class RequestImageModel {

        public string FilterString { get; set; }
        public string Extension { get; set; }
        public IFormFile Image {get; set;}
    }
}