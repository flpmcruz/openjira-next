import { db } from "@/database";
import { Entry, IEntry } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

type Data = { message: string } | IEntry;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "El id no es valido" });
  }

  switch (req.method) {
    case "PUT":
      return updateEntry(req, res);

    case "GET":
      return getEntry(req, res);

    case "DELETE":
      return deleteEntry(req, res);

    default:
      return res.status(400).json({ message: "EndPoint No existe" });
  }
}

const updateEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;

  const entryToUpdate = await Entry.findById(id);

  if (!entryToUpdate) {
    await db.disconnect();
    return res.status(400).json({ message: "No hay entrada con ese id" });
  }

  const {
    description = entryToUpdate.description,
    status = entryToUpdate.status,
  } = req.body;

  try {
    const updatedEntry = await Entry.findByIdAndUpdate(
      id,
      { description, status },
      { runValidators: true, new: true }
    );
    await db.disconnect();
    res.status(200).json(updatedEntry!);
  } catch (error) {
    console.log({ error });
    res.status(400).json({ message: "Ha habido un error" });
    db.disconnect();
  }
};

const deleteEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  db.connect();
  await Entry.findByIdAndDelete(id);
  db.disconnect();

  res.status(200).json({ message: "Entrada eliminada" });
};

const getEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  db.connect();
  const entry = await Entry.findById(id);
  db.disconnect();

  if (!entry) {
    await db.disconnect();
    return res.status(400).json({ message: "No hay entrada con ese id" });
  }

  res.status(200).json(entry);
};
