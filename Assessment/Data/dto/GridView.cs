namespace Assessment.Data.dto
{
    public class GridView
    {
        public string draw { get; set; }
        public int recordsFiltered { get; set; }
        public int recordsTotal { get; set; }
        public object data { get; set; }
        public string message { get; set; }
        public bool statusCode { get; set; }
        public int SizeData { get; set; }

    }

    public class GridConfigModel
    {
        //default
        public string sEcho { get; set; }
        public string sSearch { get; set; }
        public int iDisplayLength { get; set; }
        public int iDisplayStart { get; set; }
        public string iColumns { get; set; }
        public string iSortingCols { get; set; }
        public string sColumns { get; set; }
        public int iSortCol { get; set; }
        public string sSortDir { get; set; }

       
    }
}
