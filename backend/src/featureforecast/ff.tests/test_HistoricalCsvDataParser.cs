using equalidator;
using ff.service;
using ff.service.data;
using NUnit.Framework;

namespace ff.tests
{
    [TestFixture]
    public class test_HistoricalCsvDataParser
    {
        [Test]
        public void Happy_day()
        {
            var result = HistoricalCsvDataParser.Parse("3.14;a,b\n42;c");
            Equalidator.AreEqual(new[] {
                    new History.Datapoint{Value=3.14f,Tags=new[]{"a","b"}},
                    new History.Datapoint{Value=42f,Tags=new[]{"c"}}
                },
                result);
        }
        
        [Test]
        public void Normalize_value_to_invariant()
        {
            var result = HistoricalCsvDataParser.Parse("3,14;a,b");
            Equalidator.AreEqual(new[] {
                    new History.Datapoint{Value=3.14f,Tags=new[]{"a","b"}}
                },
                result);
        }
        
        [Test]
        public void Deal_with_whitespace()
        {
            var result = HistoricalCsvDataParser.Parse(" 3.14 ; a , b \r\n\n42;c\n  \n1;d");
            Equalidator.AreEqual(new[] {
                    new History.Datapoint{Value=3.14f,Tags=new[]{"a","b"}},
                    new History.Datapoint{Value=42f,Tags=new[]{"c"}},
                    new History.Datapoint{Value=1f,Tags=new[]{"d"}},
                },
                result);
        }
        
        [Test]
        public void Deal_with_missing_tags()
        {
            var result = HistoricalCsvDataParser.Parse("1;a\n2;b,\n3;,c\n4");
            Equalidator.AreEqual(new[] {
                    new History.Datapoint{Value=1f,Tags=new[]{"a"}},
                    new History.Datapoint{Value=2f,Tags=new[]{"b"}},
                    new History.Datapoint{Value=3f,Tags=new[]{"c"}},
                    new History.Datapoint{Value=4f,Tags=new string[0]}
                },
                result);
        }
    }
}