import cx from "classnames";
import styles from "../../styles/styles.module.scss";
import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import GridCellExpand from "./GridCellExpand.js";
import Image from "next/image";

function renderCellExpand(params) {
  return (
    <GridCellExpand
      value={params.value || ""}
      width={params.colDef.computedWidth}
    />
  );
}

const myLoader = ({ src, width, quality }) => {
  return `${src}`;
};

const Table = ({ existingMovies }) => {
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
        col1: family_likes,
        col2: image_url,
        col3: movie_name,
        col4: description,
        col5: release_date,
        col6: media_type,
        col7: streaming_services.flatrate[0].map(({ name }) => name).join(", "),
        col8: streaming_services.rent[0].map(({ name }) => name).join(", "),
        col9: streaming_services.buy[0].map(({ name }) => name).join(", "),
      };
    }
  );

  const columns = [
    { field: "col1", headerName: "Family Likes", width: 150, align: "center" },
    {
      field: "col2",
      headerName: "Image URL",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Image
              loader={myLoader}
              src={params.value}
              alt="Picture of the author"
              width={500}
              height={500}
            />
          </>
        );
      },
    },
    { field: "col3", headerName: "Title", width: 100, align: "center" },
    {
      field: "col4",
      headerName: "Description",
      width: 150,
      renderCell: renderCellExpand,
    },
    { field: "col5", headerName: "Release Date", width: 150 },
    { field: "col6", headerName: "Movie or TV?", width: 150 },
    {
      field: "col7",
      headerName: "Included",
      width: 200,
    },
    {
      field: "col8",
      headerName: "Rent",
      width: 200,
    },
    {
      field: "col9",
      headerName: "Buy",
      width: 200,
    },
  ];

  return (
    <div style={{ height: 700, width: "100%" }}>
      <DataGrid getRowHeight={() => "200px"} rows={rows} columns={columns} />
    </div>
  );
};

export default Table;
