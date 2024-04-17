using Assessment.Data.DataAccess;
using Assessment.Data.dto;
using Assessment.Models;
using System.Xml.Linq;

namespace Assessment.Data.Repository
{
    public class CreditCardRepo
    {
        private readonly IsqlDataAccess _dataAccess;
        private readonly IConfiguration _configuration;
        public CreditCardRepo(IsqlDataAccess db, IConfiguration configuration)
        {
            _dataAccess = db;
            _configuration = configuration;
        }
        public List<mscreditcard> GetListCCByNo(string accNo)
        {
            var data = GetListCC(accNo).Result.ToList();
            return data;
        }
        private async Task<IEnumerable<mscreditcard>> GetListCC(string accNo)
        {
            string query = @"select creadit_type,bank from tbl_cc";

            
            if (!string.IsNullOrEmpty(accNo))
            {
                query += " where number_card like @accNo";
            }
            var param = new Dictionary<string, object> {
                    { "accNo", accNo+"%" }
                    };
            return await _dataAccess.GetData<mscreditcard, dynamic>(query, param, false);
        }
    }
}
