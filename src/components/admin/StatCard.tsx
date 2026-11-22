"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type StatCardProps = {
  label: string;
  value: number;
  href?: string; // opsional: kalau ada, kartu bisa diklik
};

export default function StatCard({ label, value, href }: StatCardProps) {
  const content = (
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" component="p" sx={{ mt: 1 }}>
        {value}
      </Typography>
    </CardContent>
  );

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      {href ? (
        <CardActionArea component={Link} href={href} sx={{ height: "100%" }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
}