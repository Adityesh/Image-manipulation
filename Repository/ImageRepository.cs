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

        internal void ResizeAndApplyFilter(ref Image image, Filters filters)
        {
            try
            {
                int Width = image.Width;
                int Height = image.Height;
                // Brightness can be between 0 and 1
                // Contrast can be between 0 and 1
                // Grayscale, Sepia,  Opacity between 0 and 1
                // Pixelate can be any int
                image.Mutate(x =>
                {


                    if (filters == null) return;

                    if (filters.Resolution != null)
                    {
                        x.Resize((int)Math.Floor(Width * filters.Resolution.Value), (int)Math.Floor(Height * filters.Resolution.Value));
                    }

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

                    if (filters.Pixelate != null && filters.Pixelate > 0)
                    {
                        x.Pixelate(filters.Pixelate.Value);
                    }

                    if (filters.Grayscale != null)
                    {
                        x.Grayscale(filters.Grayscale.Value);
                    }
                });
            }
            catch (Exception ex)
            {
                return;
            }
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

            var guid = Guid.NewGuid();
            var filename = guid + "." + model.Extension;
            var pathToNewFile = _webHostEnvironment.ContentRootPath + "/Image/" + filename;

            ResizeAndApplyFilter(ref image, model.Filters);

            await image.SaveAsync(pathToNewFile);
            byte[] file = await System.IO.File.ReadAllBytesAsync(pathToNewFile);

            // Both types of file are read, safe to delete both
            DeleteFilesFromDisk(new string[] {
                    pathToFile,
                    pathToNewFile
                });
            

            int Height = model.Filters.Resolution == null ? image.Height : (int)Math.Floor(image.Width * model.Filters.Resolution.Value);
            int Width = model.Filters.Resolution == null ? image.Width : (int)Math.Floor(image.Width * model.Filters.Resolution.Value);

            var result =  new ResponseImageModel
            {
                Height = Height, 
                Width = Width,
                Size = file.Length,
                Image = file,
                Name = filename
            };

            image.Dispose();

            return result;


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


            var guid = Guid.NewGuid();
            var filename = guid + "." + model.Extension;
            var pathToNewFile = _webHostEnvironment.ContentRootPath + "/Image/" + filename;
            ResizeAndApplyFilter(ref image, model.Filters);


            await image.SaveAsync(pathToNewFile);
            byte[] file = await System.IO.File.ReadAllBytesAsync(pathToNewFile);

            // Both types of file are read, safe to delete both
            DeleteFilesFromDisk(new string[] {
                    pathToFile,
                    pathToNewFile
                });

            int Height = model.Filters.Resolution == null ? image.Height : (int)Math.Floor(image.Width * model.Filters.Resolution.Value);
            int Width = model.Filters.Resolution == null ? image.Width : (int)Math.Floor(image.Width * model.Filters.Resolution.Value);

            var result =  new ResponseImageModel
            {
                Height = Height, 
                Width = Width,
                Size = file.Length,
                Image = file,
                Name = filename
            };

            image.Dispose();

            return result;

        }
    }
}