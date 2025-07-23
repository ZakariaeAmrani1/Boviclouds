import { RequestHandler } from "express";

// Mock documents data - replace with actual implementation
const mockDocuments = [
  {
    id: "1",
    title: "Guide d'utilisation du système",
    type: "guide",
    url: "/docs/user-guide.pdf",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Manuel de maintenance",
    type: "manual",
    url: "/docs/maintenance-manual.pdf",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

export const getDocuments: RequestHandler = (_req, res) => {
  res.json({
    documents: mockDocuments,
    total: mockDocuments.length,
  });
};

export const getDocument: RequestHandler = (req, res) => {
  const { id } = req.params;
  const document = mockDocuments.find((doc) => doc.id === id);

  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  res.json(document);
};
