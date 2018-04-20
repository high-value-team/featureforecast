using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using ff.service.data;

namespace ff.service
{
    /* Expected format for historical CSV data (exported from Excel):
     *     2,4;tag1,tag2
     *     5,2;tag2
     *     2,2;
     *
     * First column is the value, second column are the tags separated by ",".
     * Columns separated by ";".
     * 
     * Value can be written 3,14 or 3.14.
     */
    public static class HistoricalCsvDataParser
    {
        public static History.Datapoint[] Parse(string historicalCsvData) {
            if (string.IsNullOrWhiteSpace(historicalCsvData)) return new History.Datapoint[0];

            var csvlines = Split_into_lines(historicalCsvData);
            var records = Split_columns(csvlines);
            return Map_to_datapoints(records);
        }

        private static string[] Split_into_lines(string text)
            => text.Split(new[] {'\n', '\r'}, StringSplitOptions.RemoveEmptyEntries)
                   .Where(l => !string.IsNullOrWhiteSpace(l))
                   .ToArray();

        private static string[][] Split_columns(IEnumerable<string> csvlines)
            => csvlines.Select(l => l.Split(new[] {';'}))
                       .Select(r => new[]{r[0].Trim(), r.Length>1 ? r[1].Trim() : ""})
                       .ToArray();

        private static History.Datapoint[] Map_to_datapoints(string[][] records)
        {
            return records.Select(Map_to_datapoint).ToArray();

            History.Datapoint Map_to_datapoint(string[] record) {
                var value = float.Parse(record[0].Replace(",", "."), CultureInfo.InvariantCulture);
                var tags = record[1].Split(new[] {','}, StringSplitOptions.RemoveEmptyEntries)
                                    .Select(t => t.Trim())
                                    .ToArray();
                return new History.Datapoint {
                    Value = value,
                    Tags = tags
                };
            }
        }
    }
}