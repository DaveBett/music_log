import axios from "axios"

const BASE_URL = "/api/";
const GET_URL = `${BASE_URL}entries`;
const POST_URL = `${BASE_URL}entries`;
const UPDATE_URL = (id) => `${BASE_URL}entries/${id}`;
const DELETE_URL = (id) => `${BASE_URL}entries/${id}`;

export const get_entries = async () => {
  const response = await axios.get(GET_URL);
  return response.data
}

export const create_entry = async (artist, title, year) => {
  try {
    const response = await axios.post(
      POST_URL,
      {
        entry: {
          "artist":artist,
          "title":title,
          "year":year
        }
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    ); 
    
    return response.data;
  } catch (error) {
    console.log("ERROR:", error);
    console.log("MESSAGE:", error.message);
    console.log("CODE:", error.code);
    console.log("RESPONSE:", error.response);
    console.log("REQUEST:", error.request);
    throw error;
  }

}

export const delete_entry = async (id) => {
  const response = await axios.delete(
    DELETE_URL(id),
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.data;
}

export const update_entry = async (id, artist, title, year) => {
  const response = await axios.patch(
    UPDATE_URL(id),
      {
        entry: {
          "artist":artist,
          "title":title,
          "year":year
        }
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
  return response.data
}