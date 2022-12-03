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
    ({
      id,
      movie_name,
      description,
      release_date,
      family_likes,
      image_url,
      media_type,
      streaming_services,
    }) => {
      return {
        id: id,
        col1: movie_name,
        col2: description,
        col3: release_date,
        col4: family_likes,
        col5: image_url,
        col6: media_type,
        col7: streaming_services.flatrate.map(({ name }) => name).join(", "),
        col8: streaming_services.rent.map(({ name }) => name).join(", "),
        col9: streaming_services.buy.map(({ name }) => name).join(", "),
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
    { field: "col3", headerName: "Release Date", width: 150 },
    { field: "col4", headerName: "Family Likes", width: 150 },
    { field: "col5", headerName: "Image URL", width: 150 },
    { field: "col6", headerName: "Movie or TV?", width: 150 },
    {
      field: "col7",
      headerName: "Included",
      width: 200,
      height: 200,
    },
    {
      field: "col8",
      headerName: "Rent",
      width: 200,
      height: 200,
    },
    {
      field: "col9",
      headerName: "Buy",
      width: 200,
      height: 200,
    },
  ];

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default Table;
