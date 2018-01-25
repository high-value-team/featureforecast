namespace ff.service.data.dto
{
    public class ForecastRequestDto
    {
        public FeatureDto[] Features;

        public class FeatureDto {
            public string[] Tags;
            public int Quantity;
        }
    }
}