import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type VisitorChartProps = {
  data: { day: string; label: string; count: number }[];
};

export default function VisitorChart({ data }: VisitorChartProps) {
  const max = Math.max(10, ...data.map((d) => d.count));

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        Pengunjung 14 hari terakhir
      </Typography>

      <Stack direction="row" spacing={0.75} sx={{ alignItems: "flex-end", height: 160 }}>
        {data.map((d) => (
          <Stack key={d.day} sx={{ flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">
              {d.count > 0 ? d.count : ""}
            </Typography>
            <Box
              title={`${d.label}: ${d.count} pengunjung`}
              sx={{
                width: "100%",
                height: `${Math.round((d.count / max) * 100)}%`,
                minHeight: d.count > 0 ? 4 : 2,
                bgcolor: d.count > 0 ? "primary.main" : "divider",
                borderRadius: "4px 4px 0 0",
              }}
            />
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" sx={{ justifyContent: "space-between", mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {data[0]?.label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Hari ini
        </Typography>
      </Stack>
    </Paper>
  );
}
