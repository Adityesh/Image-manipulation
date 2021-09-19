using System.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using image_search.Models;
using image_search.Services;
using Microsoft.Extensions.Logging;

namespace image_search.Controllers
{
    
    [ApiController]
    [Route("[controller]")]
    public class ImageController : ControllerBase
    {

        private readonly IImageRepository _imageRepository;

        public ImageController(IImageRepository imageRepository) {
            _imageRepository = imageRepository;
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult> ResizeImage([FromForm] RequestImageModel model) {
            System.IO.MemoryStream mStream = new System.IO.MemoryStream(System.Text.Encoding.UTF8.GetBytes(model.FilterString));
            var modelUpdated = new ResizeImageModel {
                Extension = model.Extension,
                Image = model.Image,
                Filters = await JsonSerializer.DeserializeAsync<Filters>(mStream, new JsonSerializerOptions{
                    PropertyNameCaseInsensitive = true
                })
            };
            var result = await _imageRepository.ResizeImage(modelUpdated);
            if(result == null) {
                return StatusCode(500, "Image could not be resized, please try again.");
            }
            Response.Headers.Add("ImageSize", result.Size.ToString());
            Response.Headers.Add("Height", result.Height.ToString());
            Response.Headers.Add("Width", result.Width.ToString());
            Response.Headers.Add("Name", result.Name);
            return File(result.Image, "image/" + model.Extension, result.Name);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult> ResizeImageByUrl([FromBody] ResizeImageUrlModel model) {
            var result = await _imageRepository.ResizeImageByUrl(model);
            if(result == null) {
                return StatusCode(500, "Url maybe invalid. Image could not be resized, please try again.");
            }
            Response.Headers.Add("ImageSize", result.Size.ToString());
            Response.Headers.Add("Height", result.Height.ToString());
            Response.Headers.Add("Width", result.Width.ToString());
            Response.Headers.Add("Name", result.Name);
            return File(result.Image, "image/" + model.Extension, result.Name);
            
        }



        

        
    }
}
