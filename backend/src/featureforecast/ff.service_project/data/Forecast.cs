namespace ff.service
{
    public class Forecast {
        public PossibleOutcome[] Distribution;
        
        public class PossibleOutcome {
            public float Value;
            public float Probability;
        }
    }
}