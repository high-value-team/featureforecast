namespace ff.service.data.dto
{
    public class ForecastRequestDto
    {
        public class FeatureDto {
            public string[] Tags;
            public int Quantity;
        }

        public FeatureDto[] Features;
    }
}