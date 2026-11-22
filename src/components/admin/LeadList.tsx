"use client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { formatRupiah } from "@/lib/format";
import { FOLLOW_UP_LABELS, toWhatsAppNumber } from "@/lib/order";
import { setFollowUp } from "@/app/admin/(dashboard)/leads/action";

export type LeadRow = {
  id: number;
  code: string;
  shortDate: string;
  dateTime: string;
  name: string;
  company: string | null;
  phone: string;
  region: string;
  address: string;
  subtotal: number;
  followedUp: boolean;
  items: { id: number; name: string; price: number; qty: number }[];
};

type LeadListProps = {
  leads: LeadRow[];
};

export default function LeadList({ leads }: LeadListProps) {
  return (
    <Box>
      {leads.map((lead) => (
        <LeadItem key={lead.id} lead={lead} />
      ))}
    </Box>
  );
}

function LeadItem({ lead }: { lead: LeadRow }) {
  const chatMessage =
    `Halo ${lead.name}, terima kasih sudah memesan di PT Solution Corp Indonesia. ` +
    `Kami ingin mengonfirmasi pesanan #${lead.code} dan ongkos kirimnya.`;
  const chatUrl = `https://wa.me/${toWhatsAppNumber(lead.phone)}?text=${encodeURIComponent(chatMessage)}`;

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // jangan ikut membuka/menutup accordion
    if (!lead.followedUp) setFollowUp(lead.id, true);
  };

  return (
    <Accordion disableGutters variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2 }}
          sx={{ width: "100%", alignItems: { sm: "center" }, pr: 1 }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 500 }} noWrap>
              {lead.name}
              {lead.company && (
                <Typography component="span" color="text.secondary">
                  {" "}· {lead.company}
                </Typography>
              )}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 52 }}>
              {lead.shortDate}
            </Typography>
            <Chip
              size="small"
              label={lead.followedUp ? FOLLOW_UP_LABELS.SELESAI : FOLLOW_UP_LABELS.BARU}
              color={lead.followedUp ? "success" : "warning"}
              variant={lead.followedUp ? "outlined" : "filled"}
            />
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<WhatsAppIcon />}
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleChatClick}
            >
              Chat
            </Button>
          </Stack>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          #{lead.code} · {lead.dateTime} WIB
        </Typography>

        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="body2">WA: {lead.phone}</Typography>
          <Typography variant="body2">Wilayah: {lead.region}</Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            Alamat: {lead.address}
          </Typography>
        </Stack>

        <Box sx={{ maxWidth: 420 }}>
          {lead.items.map((item) => (
            <Stack key={item.id} direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {item.name} × {item.qty}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {formatRupiah(item.price * item.qty)}
              </Typography>
            </Stack>
          ))}
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Subtotal
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatRupiah(lead.subtotal)}
            </Typography>
          </Stack>
        </Box>

        {lead.followedUp && (
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button size="small" color="inherit" onClick={() => setFollowUp(lead.id, false)}>
              Tandai belum FU
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}