using System.IO;
using System.Web;
using System.Drawing;
using System.Net;
using System.Numerics;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System;
using image_search.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using image_search.Models;
using Microsoft.AspNetCore.Hosting;

namespace image_search.Repository
{
    public class ImageRepository : IImageRepository
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImageRepository(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }
        internal async Task<string> SaveImageToDisk(IFormFile file, string ext)
        {
            try
            {
                var filePath = _webHostEnvironment.ContentRootPath + "/Image/" + Guid.NewGuid() + "." + ext;

                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);

                    return filePath;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        internal async Task<string> SaveImageFromUrlToDisk(string url, string ext)
        {


            WebClient client = new WebClient();
            // File extension is known
            if (!string.IsNullOrEmpty(ext))
            {
                string path = _webHostEnvironment.ContentRootPath + "/Image/" + Guid.NewGuid() + "." + ext;
                await Task.Run(() =>
                {
                    client.DownloadFile(new Uri(url), path);
                });
                client.Dispose();
                return path;

            }
            client.Dispose();
            // File extension is not known
            return null;

        }

        internal void DeleteFilesFromDisk(string[] paths)
        {
            foreach (string path in paths)
            {
                try
                {
                    File.Delete(path);
                }
                catch (Exception)
                {
                    continue;
                }
            }
        }

        internal void ResizeAndApplyFilter(ref Image image, int? NewHeight, int? NewWidth, Filters filters, float? ReducePercentage)
        {
            int ReduceHeight = 0;
            int ReduceWidth = 0;
            if (ReducePercentage != null)
            {
                // Reduce image by the percentage
                ReduceHeight = (int)(image.Height * ReducePercentage.Value);
                ReduceWidth = (int)(image.Width * ReducePercentage.Value);
            }

            if (NewHeight != null && NewWidth != null)
            {
                // Reduce image by the given dimensions
                ReduceHeight = NewHeight.Value;
                ReduceWidth = NewWidth.Value;
            }

            // Brightness can be between 0 and 1
            // Contrast can be between 0 and 1
            // Grayscale, Sepia,  Opacity between 0 and 1
            // Pixelate can be any int
            image.Mutate(x =>
            {
                x.Resize(ReduceWidth, ReduceHeight);

                if (filters == null) return;

                if (filters.Brightness != null)
                {
                    x.Brightness(filters.Brightness.Value);
                }

                if (filters.Contrast != null)
                {
                    x.Contrast(filters.Contrast.Value);
                }

                if (filters.Opacity != null)
                {
                    x.Opacity(filters.Opacity.Value);
                }

                if (filters.Sepia != null)
                {
                    x.Sepia(filters.Sepia.Value);
                }

                if (filters.Pixelate != null)
                {
                    x.Pixelate(filters.Pixelate.Value);
                }

                if (filters.Grayscale != null)
                {
                    x.Grayscale(filters.Grayscale.Value);
                }




            });
        }

        public async Task<ResponseImageModel> ResizeImage(ResizeImageModel model)
        {
            var pathToFile = await SaveImageToDisk(model.Image, model.Extension);

            // File could not be saved, resize not possible
            if (string.IsNullOrEmpty(pathToFile))
            {
                return null;
            }

            Image image = await Image.LoadAsync(pathToFile);

            int ReduceHeight = 0;
            int ReduceWidth = 0;

            var pathToNewFile = _webHostEnvironment.ContentRootPath + "/Image/" + Guid.NewGuid() + "." + model.Extension;

            ResizeAndApplyFilter(ref image, model.NewHeight, model.NewWidth, model.Filters, model.ReducePercentage);

            await image.SaveAsync(pathToNewFile);
            byte[] file = await System.IO.File.ReadAllBytesAsync(pathToNewFile);

            // Both types of file are read, safe to delete both
            DeleteFilesFromDisk(new string[] {
                    pathToFile,
                    pathToNewFile
                });
            image.Dispose();
            return new ResponseImageModel
            {
                Height = ReduceHeight,
                Width = ReduceWidth,
                Size = file.Length,
                Image = file
            };


        }

        public async Task<ResponseImageModel> ResizeImageByUrl(ResizeImageUrlModel model)
        {
            string pathToFile = await SaveImageFromUrlToDisk(model.ImageUrl, model.Extension);
            if (pathToFile == null)
            {
                return null;
            }

            // Image was saved
            Image image = await Image.LoadAsync(pathToFile);
            
            int ReduceHeight = 0;
            int ReduceWidth = 0;


            var pathToNewFile = _webHostEnvironment.ContentRootPath + "/Image/" + Guid.NewGuid() + "." + model.Extension;

            ResizeAndApplyFilter(ref image, model.NewHeight, model.NewWidth, model.Filters, model.ReducePercentage);


            await image.SaveAsync(pathToNewFile);
            byte[] file = await System.IO.File.ReadAllBytesAsync(pathToNewFile);

            // Both types of file are read, safe to delete both
            DeleteFilesFromDisk(new string[] {
                    pathToFile,
                    pathToNewFile
                });
            image.Dispose();
            return new ResponseImageModel
            {
                Height = ReduceHeight,
                Width = ReduceWidth,
                Size = file.Length,
                Image = file
            };

        }
    }
}