"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type StatCardProps = {
  label: string;
  value: number;
  href: string;
};

export default function StatCard({ label, value, href }: StatCardProps) {
  return (
    <Card variant="outlined">
      <CardActionArea component={Link} href={href}>
        <CardContent>
          <Typography color="text.secondary">{label}</Typography>
          <Typography variant="h3" component="p" sx={{ mt: 1 }}>
            {value}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}