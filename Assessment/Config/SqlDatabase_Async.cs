using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace Assessment.Config
{
    public class SqlDatabase_Async
    {
        private async Task<bool> PrepareCommandAsync(SqlCommand command, SqlConnection connection, SqlTransaction transaction, CommandType commandType, string commandText, Dictionary<string, object> commandParameters)
        {
            if (command == null)
            {
                throw new ArgumentNullException("command");
            }

            if (string.IsNullOrEmpty(commandText))
            {
                throw new ArgumentNullException("commandText");
            }

            bool mustCloseConnection = false;
            if (connection.State != ConnectionState.Open)
            {
                mustCloseConnection = true;
                await connection.OpenAsync().ConfigureAwait(continueOnCapturedContext: false);
            }

            command.Connection = connection;
            command.CommandText = commandText;
            if (transaction != null)
            {
                if (transaction.Connection == null)
                {
                    throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
                }

                command.Transaction = transaction;
            }

            command.CommandType = commandType;
            if (commandParameters != null)
            {
                AttachParameters(command, commandParameters);
            }

            return mustCloseConnection;
        }

        private void AttachParameters(SqlCommand command, Dictionary<string, object> param)
        {
            if (command == null)
            {
                throw new ArgumentNullException("command");
            }

            if (param == null || param.Count <= 0)
            {
                return;
            }

            foreach (string key in param.Keys)
            {
                command.Parameters.AddWithValue(key, param[key]);
            }
        }

        public Task<DataTable> ExecuteDataTable(string connectionString, string spName, Dictionary<string, object> parameterValues)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException("connectionString");
            }

            if (string.IsNullOrEmpty(spName))
            {
                throw new ArgumentNullException("spName");
            }

            return ExecuteDataTableAsync(connectionString, CommandType.Text, spName, parameterValues);
        }

        public Task<DataTable> ExecuteDataTableWithTrans(SqlTransaction transaction, string spName, Dictionary<string, object> parameterValues)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException("transaction");
            }

            if (transaction != null && transaction.Connection == null)
            {
                throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            }

            if (string.IsNullOrEmpty(spName))
            {
                throw new ArgumentNullException("spName");
            }

            return ExecuteDataTableAsync(transaction, CommandType.Text, spName, parameterValues);
        }

        public Task<DataSet> ExecuteDataset(SqlConnection connection, string spName, Dictionary<string, object> parameterValues)
        {
            if (connection == null)
            {
                throw new ArgumentNullException("connection");
            }

            if (string.IsNullOrEmpty(spName))
            {
                throw new ArgumentNullException("spName");
            }

            return ExecuteDatasetAsync(connection, CommandType.Text, spName, parameterValues);
        }

        public Task<DataSet> ExecuteDatasetWithTrans(SqlTransaction transaction, string spName, Dictionary<string, object> parameterValues)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException("transaction");
            }

            if (transaction != null && transaction.Connection == null)
            {
                throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            }

            if (string.IsNullOrEmpty(spName))
            {
                throw new ArgumentNullException("spName");
            }

            return ExecuteDatasetAsync(transaction, CommandType.Text, spName, parameterValues);
        }

        public Task<string> GetString(string connectionString, string spName, Dictionary<string, object> parameterValues)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException("connectionString");
            }

            if (string.IsNullOrEmpty(spName))
            {
                throw new ArgumentNullException("spName");
            }

            return GetStringAsync(connectionString, CommandType.Text, spName, parameterValues);
        }

        public Task<int> ExecuteNonQuery(string connectionString, string spName, Dictionary<string, object> parameterValues)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException("connectionString");
            }

            if (string.IsNullOrEmpty(spName))
            {
                throw new ArgumentNullException("spName");
            }

            return ExecuteNonQueryAsync(connectionString, CommandType.Text, spName, parameterValues);
        }

        public Task<int> ExecuteNonQueryWithTrans(SqlTransaction transaction, string spName, Dictionary<string, object> parameterValues)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException("transaction");
            }

            if (transaction != null && transaction.Connection == null)
            {
                throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            }

            if (string.IsNullOrEmpty(spName))
            {
                throw new ArgumentNullException("spName");
            }

            return ExecuteNonQueryAsync(transaction, CommandType.Text, spName, parameterValues);
        }

        public async Task<DataTable> ExecuteDataTableAsync(string connectionString, CommandType commandType, string commandText, Dictionary<string, object> commandParameters)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException("connectionString");
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync().ConfigureAwait(continueOnCapturedContext: false);
                DataSet DS = await ExecuteDatasetAsync(connection, commandType, commandText, commandParameters).ConfigureAwait(continueOnCapturedContext: false);
                if (DS.Tables[0] != null)
                {
                    return DS.Tables[0];
                }
            }

            return null;
        }

        public async Task<DataTable> ExecuteDataTableAsync(SqlTransaction transaction, CommandType commandType, string commandText, Dictionary<string, object> commandParameters)
        {
            DataSet DS = await ExecuteDatasetAsync(transaction, commandType, commandText, commandParameters).ConfigureAwait(continueOnCapturedContext: false);
            if (DS.Tables[0] != null)
            {
                return DS.Tables[0];
            }

            return null;
        }

        public async Task<DataSet> ExecuteDatasetAsync(SqlConnection connection, CommandType commandType, string commandText, Dictionary<string, object> commandParameters)
        {
            if (connection == null)
            {
                throw new ArgumentNullException("connection");
            }

            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = await PrepareCommandAsync(cmd, connection, null, commandType, commandText, commandParameters).ConfigureAwait(continueOnCapturedContext: false);
            using SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            da.Fill(ds);
            cmd.Parameters.Clear();
            if (mustCloseConnection)
            {
                connection.Close();
            }

            return ds;
        }

        public async Task<DataSet> ExecuteDatasetAsync(SqlTransaction transaction, CommandType commandType, string commandText, Dictionary<string, object> commandParameters)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException("transaction");
            }

            if (transaction != null && transaction.Connection == null)
            {
                throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            }

            SqlCommand cmd = new SqlCommand();
            await PrepareCommandAsync(cmd, transaction.Connection, transaction, commandType, commandText, commandParameters).ConfigureAwait(continueOnCapturedContext: false);
            using SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataSet ds = new DataSet();
            da.Fill(ds);
            cmd.Parameters.Clear();
            return ds;
        }

        public async Task<string> GetStringAsync(string connectionString, CommandType commandType, string commandText, Dictionary<string, object> commandParameters)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException("connectionString");
            }

            using SqlConnection connection = new SqlConnection(connectionString);
            await connection.OpenAsync().ConfigureAwait(continueOnCapturedContext: false);
            DataSet DS = await ExecuteDatasetAsync(connection, commandType, commandText, commandParameters).ConfigureAwait(continueOnCapturedContext: false);
            if (DS.Tables[0] != null)
            {
                return DS.Tables[0].Rows[0][0].ToString();
            }

            return "";
        }

        public async Task<int> ExecuteNonQueryAsync(string connectionString, CommandType commandType, string commandText, Dictionary<string, object> commandParameters)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException("connectionString");
            }

            using SqlConnection connection = new SqlConnection(connectionString);
            await connection.OpenAsync().ConfigureAwait(continueOnCapturedContext: false);
            return await ExecuteNonQueryAsync(connection, commandType, commandText, commandParameters).ConfigureAwait(continueOnCapturedContext: false);
        }

        public async Task<int> ExecuteNonQueryAsync(SqlConnection connection, CommandType commandType, string commandText, Dictionary<string, object> commandParameters)
        {
            if (connection == null)
            {
                throw new ArgumentNullException("connection");
            }

            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = await PrepareCommandAsync(cmd, connection, null, commandType, commandText, commandParameters).ConfigureAwait(continueOnCapturedContext: false);
            int retval = await cmd.ExecuteNonQueryAsync().ConfigureAwait(continueOnCapturedContext: false);
            cmd.Parameters.Clear();
            if (mustCloseConnection)
            {
                connection.Close();
            }

            return retval;
        }

        public async Task<int> ExecuteNonQueryAsync(SqlTransaction transaction, CommandType commandType, string commandText, Dictionary<string, object> commandParameters)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException("transaction");
            }

            if (transaction != null && transaction.Connection == null)
            {
                throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            }

            SqlCommand cmd = new SqlCommand();
            await PrepareCommandAsync(cmd, transaction.Connection, transaction, commandType, commandText, commandParameters).ConfigureAwait(continueOnCapturedContext: false);
            int retval = await cmd.ExecuteNonQueryAsync().ConfigureAwait(continueOnCapturedContext: false);
            cmd.Parameters.Clear();
            return retval;
        }
    }
}
