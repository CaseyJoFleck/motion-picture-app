import cx from "classnames";
import styles from "../../styles/styles.module.scss";
import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import GridCellExpand from "./GridCellExpand.js";
import Image from "next/image";
import { BiLike, BiTrash } from "react-icons/bi";

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

const Table = ({ existingMovies, handleLikes, handleDelete }) => {
  const rows = existingMovies.map(
    ({
      id,
      movie_name,
      description,
      release_date,
      family_likes,
      image_url,
      media_type,
      included,
      rent,
      buy,
      content_rating,
      genre,
      director,
      actors,
      runtime,
      imdbRating,
    }) => {
      return {
        id: id,
        col1: { family_likes: family_likes, id: id },
        col2: image_url,
        col3: movie_name,
        col4: media_type,
        col5: content_rating,
        col6: genre,
        col7: imdbRating,
        col8: description,
        col9: runtime,
        col10: release_date,
        col11: actors,
        col12: director,
        col13: included,
        col14: rent,
        col15: buy,
        col16: id,
      };
    }
  );

  const columns = [
    {
      field: "col1",
      headerName: "Family Likes",
      width: 100,
      align: "center",
      renderCell: (params) => {
        return (
          <>
            <button onClick={() => handleLikes(params.value.id)}>
              <BiLike className="icon" /> {params.value.family_likes}
            </button>
          </>
        );
      },
    },
    {
      field: "col2",
      headerName: "Poster",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Image
              unoptimized
              loader={myLoader}
              src={params.value}
              alt="Picture of the poster"
              width={500}
              height={500}
            />
          </>
        );
      },
    },
    { field: "col3", headerName: "Title", width: 100, align: "center" },
    { field: "col4", headerName: "Type", width: 80 },
    { field: "col5", headerName: "Content Rating", width: 120 },
    { field: "col6", headerName: "Genre", width: 100 },
    { field: "col7", headerName: "IMDB", width: 100 },
    {
      field: "col8",
      headerName: "Description",
      width: 150,
      renderCell: renderCellExpand,
    },
    { field: "col9", headerName: "Runtime", width: 80 },
    { field: "col10", headerName: "Release Date", width: 100 },
    { field: "col11", headerName: "Actors", width: 100 },
    { field: "col12", headerName: "Directors", width: 100 },
    {
      field: "col13",
      headerName: "Included",
      width: 200,
    },
    {
      field: "col14",
      headerName: "Rent",
      width: 200,
    },
    {
      field: "col15",
      headerName: "Buy",
      width: 200,
    },
    {
      field: "col16",
      headerName: "Delete?",
      width: 100,
      align: "center",
      renderCell: (params) => {
        return (
          <>
            <button onClick={() => handleDelete(params.value)}>
              <BiTrash className="icon" />
            </button>
          </>
        );
      },
    },
  ];

  return (
    <div style={{ height: 700, width: "100%" }}>
      <DataGrid getRowHeight={() => "200px"} rows={rows} columns={columns} />
    </div>
  );
};

export default Table;
