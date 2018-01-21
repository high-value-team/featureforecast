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
        
        [Test]
        public void Deal_with_whitespace2()
        {
            var result = HistoricalCsvDataParser.Parse("2");
            Equalidator.AreEqual(new[] {
                    new History.Datapoint{Value=2f,Tags=new string[0]}
                },
                result);
        }
        
        [Test]
        public void Split_into_lines() {
            var result = HistoricalCsvDataParser.Split_into_lines("1\n2\r\n3\n\r4");
            Assert.AreEqual(new[]{"1","2","3","4"}, result);
        }
        
        [Test]
        public void Empty_lines_are_removed() {
            var result = HistoricalCsvDataParser.Split_into_lines("1\n\n2\n \n3");
            Assert.AreEqual(new[]{"1","2","3"}, result);
        }

        [Test]
        public void Create_records_with_trimmed_columns()
        {
            var result = HistoricalCsvDataParser.Split_columns(new[] {" a ; b ", "x; y , z ", "s"});
            Assert.AreEqual(new[]{new[]{"a","b"}, new[]{"x","y , z"}, new[]{"s", ""}}, result);
        }

        [Test]
        public void Create_datapoints()
        {
            var result = HistoricalCsvDataParser.Map_to_datapoints(new[]
            {
                new[]{" 3.14 ", " a , b "},
                new[]{"42,0", "c"},
                new[]{"1", ",d"},
                new[]{"2", "d,"},
                new[]{"3", ""},
            });
            
            Equalidator.AreEqual(new[] {
                    new History.Datapoint{Value=3.14f,Tags=new[]{"a","b"}},
                    new History.Datapoint{Value=42f,Tags=new[]{"c"}},
                    new History.Datapoint{Value=1f,Tags=new[]{"d"}},
                    new History.Datapoint{Value=2f,Tags=new[]{"d"}},
                    new History.Datapoint{Value=3f,Tags=new string[0]}
                },
                result);
        }
    }
}