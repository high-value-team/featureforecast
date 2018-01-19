namespace ff.service.data.dto
{
    public class ForecastRequestDto
    {
        public string Id;
        public FeatureDto[] Features;

        public class FeatureDto {
            public string[] Tags;
            public int Quantity;
        }
    }
}