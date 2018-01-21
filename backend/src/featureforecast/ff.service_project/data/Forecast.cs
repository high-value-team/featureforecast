namespace ff.service
{
    public class Forecast {
        public PossibleOutcome[] Distribution;
        
        public class PossibleOutcome {
            public float Prognosis;
            public float CummulatedPrognosis;
            public float Probability;
        }
    }
}