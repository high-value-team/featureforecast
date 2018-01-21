namespace ff.service.data.dto
{
    public class ForecastDto
    {
        public string Id;
        public PossibleOutcomeDto[] Distribution;
        
        public class PossibleOutcomeDto {
            public float Prognosis;
            public float CummulatedPrognosis;
            public float Probability;
        }
    }
}