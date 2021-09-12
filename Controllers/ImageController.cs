using System.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using image_search.Models;
using image_search.Services;
using Microsoft.Extensions.Logging;

namespace image_search.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {

        private readonly IImageRepository _imageRepository;

        public ImageController(IImageRepository imageRepository) {
            _imageRepository = imageRepository;
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult> ResizeImage([FromForm] ResizeImageModel model) {
            var result = await _imageRepository.ResizeImage(model);
            if(result == null) {
                return StatusCode(500, "Image could not be resized, please try again.");
            }
            Response.Headers.Add("ImageSize", result.Size.ToString());
            Response.Headers.Add("Height", result.Height.ToString());
            Response.Headers.Add("Width", result.Width.ToString());
            
            return File(result.Image, "image/" + model.Extension);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult> ResizeImageByUrl([FromForm] ResizeImageUrlModel model) {
            var result = await _imageRepository.ResizeImageByUrl(model);
            if(result == null) {
                return StatusCode(500, "Url maybe invalid. Image could not be resized, please try again.");
            }
            Response.Headers.Add("ImageSize", result.Size.ToString());
            Response.Headers.Add("Height", result.Height.ToString());
            Response.Headers.Add("Width", result.Width.ToString());
            
            return File(result.Image, "image/" + model.Extension);
            
        }



        

        
    }
}
