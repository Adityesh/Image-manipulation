namespace image_search.Models {
    public class ResizeImageUrlModel {
        public int? NewHeight { get; set; }
        public int? NewWidth { get; set; }
        public Filters Filters { get; set; }
        public string Extension { get; set;}
        public string ImageUrl { get; set; }

        public float? ReducePercentage { get; set;}
    }
}