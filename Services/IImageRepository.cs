using System.IO;
using System.Threading.Tasks;
using image_search.Models;

namespace image_search.Services {
    public interface IImageRepository {
        Task<ResponseImageModel> ResizeImage(ResizeImageModel model);

        Task<ResponseImageModel> ResizeImageByUrl(ResizeImageUrlModel model);
    }
}