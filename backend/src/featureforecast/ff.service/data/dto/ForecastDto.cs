namespace ff.service.data.dto
{
    public class ForecastDto
    {
        public class PossibleOutcomeDto {
            public float Value;
            public float Probability;
        }
        
        public string Id;
        public PossibleOutcomeDto[] Distribution;
        public string DistributionImageUrl;
    }
}