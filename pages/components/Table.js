import cx from "classnames";
import styles from "../../styles/styles.module.scss";
import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import GridCellExpand from "./GridCellExpand.js";

function renderCellExpand(params) {
  return (
    <GridCellExpand
      value={params.value || ""}
      width={params.colDef.computedWidth}
    />
  );
}

const Table = ({ existingMovies, handleToggle }) => {
  const rows = existingMovies.map(
    ({ id, description, movie_name, watched }) => {
      return {
        id: id,
        col1: movie_name,
        col2: description,
        col3: watched ? "Yes" : "No",
      };
    }
  );

  const columns = [
    { field: "col1", headerName: "Title", width: 200 },
    {
      field: "col2",
      headerName: "Description",
      minWidth: 200,
      renderCell: renderCellExpand,
    },
    { field: "col3", headerName: "Watched?", width: 150 },
  ];

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default Table;
