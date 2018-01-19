namespace ff.service.data.dto
{
    public class ForecastDto
    {
        public string Id;
        public PossibleOutcomeDto[] Distribution;
        public string DistributionImageUrl;
        
        public class PossibleOutcomeDto {
            public float Value;
            public float Probability;
        }
    }
}