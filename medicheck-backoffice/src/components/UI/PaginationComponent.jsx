import TablePagination from '@mui/material/TablePagination';
export const PaginationComponent = ({page, handlePageChange,rowsPerPage, handleChangeRowsPerPage, total})=>{

   return ( <TablePagination
     component={"div"}
     count={total}
     page={page}
     onPageChange={handlePageChange}
     rowsPerPage={rowsPerPage}
     onRowsPerPageChange={handleChangeRowsPerPage}
    />
   )
}