import { useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";

type IconName =
  | "spark"
  | "search"
  | "dashboard"
  | "wallet"
  | "card"
  | "transactions"
  | "budget"
  | "goals"
  | "analytics"
  | "cash"
  | "invest"
  | "help"
  | "settings"
  | "download"
  | "share"
  | "more"
  | "plus"
  | "chevron"
  | "calendar"
  | "eye"
  | "arrowUp"
  | "arrowDown"
  | "request"
  | "send"
  | "category"
  | "chip"
  | "contactless"
  | "loader";

const miniData = {
  balance: [8, 10, 13, 14, 15, 13, 16, 18, 20, 22, 21, 23, 24, 25, 24, 24, 23, 22, 20, 19, 18, 17, 17, 16, 16, 15, 15, 14],
  income: [9, 12, 16, 18, 20, 19, 21, 22, 24, 25, 27, 26, 25, 25, 24, 23, 22, 20, 18, 17, 16, 15, 15, 14, 13, 13, 12, 12],
  expense: [16, 18, 19, 21, 22, 24, 26, 25, 24, 24, 23, 22, 20, 21, 22, 23, 24, 23, 22, 20, 18, 17, 16, 15, 14, 13, 12, 12],
};

const usageData = [
  { month: "Jan", value: 12200 },
  { month: "Feb", value: 15800 },
  { month: "Mar", value: 19100 },
  { month: "Apr", value: 24400 },
  { month: "May", value: 16900 },
  { month: "Jun", value: 28712 },
  { month: "Jul", value: 21000 },
  { month: "Aug", value: 23000 },
  { month: "Sep", value: 25800 },
  { month: "Oct", value: 28600 },
  { month: "Nov", value: 22400 },
  { month: "Dec", value: 18900 },
];

const savingsData = [28, 33, 39, 45, 50, 56, 63, 70, 76, 82, 88, 94, 90, 84, 79, 72, 66, 62, 58, 55, 52, 49, 46, 43, 40, 37, 35, 32, 30, 28, 25, 23, 21, 19, 17, 15];

function Icon({ name, size = 18, className = "" }: { name: IconName; size?: number; className?: string }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  if (name === "spark") {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M12 5.5c.6 3.4 2.1 4.9 5.5 5.5-3.4.6-4.9 2.1-5.5 5.5-.6-3.4-2.1-4.9-5.5-5.5 3.4-.6 4.9-2.1 5.5-5.5Z" fill="#fff" />
      </svg>
    );
  }

  if (name === "loader") {
    return (
      <svg {...common}>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.65 5.65l2.12 2.12M16.24 16.24l2.11 2.11M18.35 5.65l-2.11 2.12M7.76 16.24l-2.11 2.11" />
      </svg>
    );
  }

  const paths: Record<Exclude<IconName, "spark" | "loader">, ReactNode> = {
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    dashboard: <><rect x="4" y="5" width="16" height="14" rx="4" /><path d="m8 13 3-3 2 2 3-4" /></>,
    wallet: <><path d="M5 7.5h13.5A2.5 2.5 0 0 1 21 10v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" /><path d="M17 12.5h4" /><path d="M7 9h4" /></>,
    card: <><rect x="3.5" y="6" width="17" height="12" rx="3" /><path d="M3.5 10h17" /><path d="M7 15h2.5" /></>,
    transactions: <><path d="M7 7h11M7 12h8M7 17h11" /><path d="M4 7h.01M4 12h.01M4 17h.01" /></>,
    budget: <><path d="M5 13.5V18h4.5" /><path d="M19 10.5V6h-4.5" /><path d="M6.5 10A6 6 0 0 1 17 7" /><path d="M17.5 14A6 6 0 0 1 7 17" /></>,
    goals: <><path d="M5 19V9" /><path d="M10 19V5" /><path d="M15 19v-7" /><path d="M20 19V8" /><path d="m4 12 5-4 4 3 6-6" /></>,
    analytics: <><path d="M12 3v18" /><path d="M4.5 8.5a8.5 8.5 0 1 0 7.5-5.48" /><path d="M12 12h8.5" /></>,
    cash: <><path d="M6 7.5h12a2 2 0 0 1 2 2v7H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" /><path d="M8 12h.01M16 12h.01" /><path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /></>,
    invest: <><path d="M4 19h16" /><path d="M6 16v-3" /><path d="M10 16V9" /><path d="M14 16v-5" /><path d="M18 16V6" /><path d="m5 10 5-4 4 3 5-5" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9.4a2.5 2.5 0 0 1 4.8.9c0 2-2.5 2-2.5 4" /><path d="M12 17.5h.01" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7.7 7.7 0 0 0-.08-1.1l2-1.55-2-3.46-2.35.95a7.1 7.1 0 0 0-1.9-1.1L14.3 3h-4.6l-.37 2.74a7.1 7.1 0 0 0-1.9 1.1l-2.35-.95-2 3.46 2 1.55A7.7 7.7 0 0 0 5 12c0 .37.03.74.08 1.1l-2 1.55 2 3.46 2.35-.95a7.1 7.1 0 0 0 1.9 1.1L9.7 21h4.6l.37-2.74a7.1 7.1 0 0 0 1.9-1.1l2.35.95 2-3.46-2-1.55c.05-.36.08-.73.08-1.1Z" /></>,
    download: <><path d="M12 4v10" /><path d="m8.5 10.5 3.5 3.5 3.5-3.5" /><path d="M5 18.5h14" /></>,
    share: <><path d="M14 5h5v5" /><path d="m19 5-8 8" /><path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" /></>,
    more: <><path d="M6 12h.01M12 12h.01M18 12h.01" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <><path d="m8 10 4 4 4-4" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
    eye: <><path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" /><circle cx="12" cy="12" r="2.2" /></>,
    arrowUp: <><path d="M7 17 17 7" /><path d="M9 7h8v8" /></>,
    arrowDown: <><path d="m7 7 10 10" /><path d="M9 17h8V9" /></>,
    request: <><path d="M17 7 7 17" /><path d="M7 10v7h7" /></>,
    send: <><path d="M7 17 17 7" /><path d="M9 7h8v8" /></>,
    category: <><path d="M12 3v18" /><path d="M21 12H3" /><circle cx="12" cy="12" r="7" /></>,
    chip: <><rect x="5" y="7" width="14" height="10" rx="2" /><path d="M8 7v10M16 7v10M5 12h14" /></>,
    contactless: <><path d="M6.5 9.5a4 4 0 0 1 0 5" /><path d="M9.5 7a8 8 0 0 1 0 10" /><path d="M12.5 5a12 12 0 0 1 0 14" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function D3MiniBars({ data, color, muted = 11 }: { data: number[]; color: string; muted?: number }) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const width = 184;
    const height = 28;
    const gap = 3.1;
    const barWidth = 3.35;
    const lineHeight = 26;
    const y = height - lineHeight;

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "none");

    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (_, index) => index * (barWidth + gap))
      .attr("y", y)
      .attr("width", barWidth)
      .attr("height", lineHeight)
      .attr("rx", 1.8)
      .attr("fill", (_, index) => (index < data.length - muted ? color : "#E9E9EC"))
      .on("mouseenter", function () {
        const nextHeight = Math.min(height, lineHeight + 2);
        d3.select(this)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("y", height - nextHeight)
          .attr("height", nextHeight);
      })
      .on("mouseleave", function () {
        d3.select(this)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("y", y)
          .attr("height", lineHeight);
      });
  }, [color, data, muted]);

  return <svg ref={ref} className="mini-bars" aria-label="Mini bar chart" role="img" />;
}

function D3SavingsBars() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const width = 288;
    const height = 36;
    const gap = 3.4;
    const barWidth = 4;
    const color = d3.scaleLinear<string>().domain([0, savingsData.length * 0.45, savingsData.length * 0.72, savingsData.length]).range(["#1EA7FF", "#297CFF", "#21C7E8", "#35D985"]);
    const lineHeight = 32;
    const y = height - lineHeight;

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "none");
    svg
      .selectAll("rect")
      .data(savingsData)
      .join("rect")
      .attr("x", (_, index) => index * (barWidth + gap))
      .attr("y", y)
      .attr("width", barWidth)
      .attr("height", lineHeight)
      .attr("rx", 2)
      .attr("fill", (_, index) => (index > 31 ? "#E9E9EC" : color(index)))
      .on("mouseenter", function (_, value) {
        const nextHeight = Math.min(height, lineHeight + 2);
        d3.select(this).transition().duration(300).ease(d3.easeCubicOut).attr("y", height - nextHeight).attr("height", nextHeight);
      })
      .on("mouseleave", function (_, value) {
        d3.select(this).transition().duration(300).ease(d3.easeCubicOut).attr("y", y).attr("height", lineHeight);
      });
  }, []);

  return <svg ref={ref} className="savings-bars" aria-label="Savings progress chart" role="img" />;
}

function D3UsageChart() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 658;
    const height = 360;
    const margin = { top: 58, right: 4, bottom: 34, left: 37 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "xMidYMid meet");

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient").attr("id", "activeBarGradient").attr("x1", "0%").attr("y1", "100%").attr("x2", "100%").attr("y2", "0%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#0D7DFF");
    gradient.append("stop").attr("offset", "62%").attr("stop-color", "#1495FF");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#5EC8FF");
    const inactiveGradient = defs.append("linearGradient").attr("id", "inactiveBarGradient").attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
    inactiveGradient.append("stop").attr("offset", "0%").attr("stop-color", "#F4F4F5");
    inactiveGradient.append("stop").attr("offset", "100%").attr("stop-color", "#E8E8E9");

    const x = d3.scaleBand().domain(usageData.map((d) => d.month)).range([0, chartWidth]).paddingInner(0.3).paddingOuter(0.03);
    const y = d3.scaleLinear().domain([0, 30000]).range([chartHeight, 0]);

    const root = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const dotGroup = root.append("g").attr("opacity", 0.9);
    const xDots = d3.range(0, chartWidth + 1, 19);
    const yDots = d3.range(0, chartHeight + 1, 20);
    dotGroup
      .selectAll("circle")
      .data(xDots.flatMap((dotX) => yDots.map((dotY) => ({ dotX, dotY }))))
      .join("circle")
      .attr("cx", (d) => d.dotX)
      .attr("cy", (d) => d.dotY)
      .attr("r", 0.95)
      .attr("fill", "#EEEFF1");

    const yTicks = [0, 5000, 10000, 15000, 20000, 25000, 30000];
    root
      .append("g")
      .selectAll("text")
      .data(yTicks)
      .join("text")
      .attr("x", -29)
      .attr("y", (d) => y(d) + 4)
      .attr("fill", "#B5B5BA")
      .attr("font-size", 13)
      .attr("font-weight", 500)
      .text((d) => `${d / 1000}k`);

    const tooltip = root.append("g").attr("class", "chart-tooltip").attr("opacity", 1);
    tooltip.append("rect").attr("width", 66).attr("height", 28).attr("x", -33).attr("y", -44).attr("rx", 7).attr("fill", "#1D1D1F").attr("filter", "drop-shadow(0 5px 10px rgba(0,0,0,.18))");
    tooltip.append("path").attr("d", "M-6 -17 0 -10 6 -17Z").attr("fill", "#1D1D1F");
    tooltip.append("text").attr("x", 0).attr("y", -26).attr("text-anchor", "middle").attr("fill", "#fff").attr("font-size", 12).attr("font-weight", 700);

    const barLayer = root
      .append("g")
      .attr("class", "usage-bars");

    barLayer
      .selectAll("rect")
      .data(usageData)
      .join("rect")
      .attr("x", (d) => (x(d.month) ?? 0) + ((x.bandwidth() - 40) / 2))
      .attr("y", chartHeight)
      .attr("width", 40)
      .attr("height", 0)
      .attr("rx", 12)
      .attr("fill", (d) => (d.month === "Jun" ? "url(#activeBarGradient)" : "url(#inactiveBarGradient)"))
      .transition()
      .duration(650)
      .delay((_, index) => index * 34)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => chartHeight - y(d.value));

    const bars = barLayer.selectAll<SVGRectElement, (typeof usageData)[number]>("rect");
    const setTooltip = (datum: (typeof usageData)[number]) => {
      const cx = (x(datum.month) ?? 0) + x.bandwidth() / 2;
      tooltip.attr("transform", `translate(${cx},${y(datum.value)})`);
      tooltip.select("text").text(`$${datum.value.toLocaleString("en-US")}`);
    };
    setTooltip(usageData[5]);

    bars
      .on("mouseenter", function (_, datum) {
        d3.select(this)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("y", y(Math.min(30000, datum.value + 1150)))
          .attr("height", chartHeight - y(Math.min(30000, datum.value + 1150)));
        setTooltip(datum);
        tooltip.interrupt().transition().duration(300).ease(d3.easeCubicOut).attr("opacity", 1);
      })
      .on("mouseleave", function (_, datum) {
        d3.select(this).transition().duration(300).ease(d3.easeCubicOut).attr("y", y(datum.value)).attr("height", chartHeight - y(datum.value));
        if (datum.month !== "Jun") {
          setTooltip(usageData[5]);
        }
      });

    root
      .append("g")
      .selectAll("text")
      .data(usageData)
      .join("text")
      .attr("x", (d) => (x(d.month) ?? 0) + x.bandwidth() / 2)
      .attr("y", chartHeight + 25)
      .attr("text-anchor", "middle")
      .attr("font-size", 13)
      .attr("font-weight", (d) => (d.month === "Jun" ? 700 : 500))
      .attr("fill", (d) => (d.month === "Jun" ? "#1D1D1F" : "#B5B5BA"))
      .text((d) => d.month);
  }, []);

  return <svg ref={ref} className="usage-chart" aria-label="Monthly usage category bar chart" role="img" />;
}

function VisaLogo() {
  return (
    <svg viewBox="0 0 92 32" className="visa-logo" aria-label="Visa Signature Business" role="img">
      <path fill="currentColor" d="M36.5 24.8h-7.1l4.4-25h7.1l-4.4 25ZM23.4-.2 16.6 17 15.8 13c-1.3-4.4-5.2-9.2-9.6-11.6l6.2 23.4h7.5L31-.2h-7.6ZM55.9 16.6c0-6.6-9.1-7-9-10 0-.9.9-1.9 2.9-2.2 1-.1 3.6-.3 6.6 1.2l1.2-5.6c-1.6-.6-3.7-1.2-6.3-1.2-6.7 0-11.4 3.5-11.4 8.6 0 3.8 3.4 5.9 6 7.2 2.7 1.3 3.6 2.2 3.6 3.4 0 1.8-2.2 2.6-4.2 2.7-3.5.1-5.6-.9-7.2-1.7l-1.3 5.9c1.6.7 4.6 1.4 7.6 1.4 7.1 0 11.7-3.5 11.7-8.9ZM73.5 24.8h6.2L74.3-.2h-5.7c-1.3 0-2.4.7-2.8 1.9L55.7 24.8h7.1l1.4-3.9h8.7l.6 3.9Zm-7.4-9.3 3.5-9.7 2 9.7h-5.5ZM4 0H-7v.5C1.5 2.6 7.1 7.6 9.4 14.1L6.9 1.9C6.5.6 5.6.1 4 0Z" transform="translate(9 3) scale(.82)" />
      <text x="44" y="28" textAnchor="middle" fontSize="4.8" fontWeight="600" fill="currentColor">Signature Business</text>
    </svg>
  );
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 58 34" className="mastercard-mark" aria-hidden="true">
      <circle cx="21" cy="17" r="14" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="37" cy="17" r="14" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function BrandIcon({ brand }: { brand: "paypal" | "youtube" | "zapier" }) {
  if (brand === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="brand-icon" aria-hidden="true">
        <rect x="4" y="7" width="16" height="10" rx="3" fill="#FF0033" />
        <path d="m10.5 10 4 2-4 2v-4Z" fill="#fff" />
      </svg>
    );
  }
  if (brand === "zapier") {
    return (
      <svg viewBox="0 0 24 24" className="brand-icon" aria-hidden="true">
        <path d="M11 4h2v6.3l4.45-4.45 1.4 1.4L14.4 11.7H21v2h-6.55l4.4 4.4-1.4 1.4L13 15.05V21h-2v-5.95L6.55 19.5l-1.4-1.4 4.4-4.4H3v-2h6.6L5.15 7.25l1.4-1.4L11 10.3V4Z" fill="#FF5A00" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="brand-icon" aria-hidden="true">
      <path d="M8.1 18.5h-3l2.2-13h6.5c2.7 0 4.5 1.4 4.2 4-.3 3-2.5 4.8-5.9 4.8H9.2l-1.1 4.2Z" fill="#003087" />
      <path d="M10.2 20.5H7.4l2-11.6h6.3c2.3 0 3.7 1.3 3.4 3.4-.4 2.8-2.5 4.4-5.6 4.4h-2.4l-.9 3.8Z" fill="#009CDE" opacity=".9" />
    </svg>
  );
}

function Sidebar() {
  const groups = [
    {
      title: "Main Menu",
      items: [
        ["dashboard", "Dashboard"],
        ["wallet", "Wallet"],
        ["card", "Cards"],
        ["transactions", "Transactions", "6"],
        ["budget", "Budget"],
        ["goals", "Goals"],
      ],
    },
    {
      title: "Analytics",
      items: [
        ["analytics", "Analytics"],
        ["cash", "Cash Flow", "2"],
        ["invest", "Investments"],
      ],
    },
    {
      title: "Others",
      items: [
        ["help", "Help Center"],
        ["settings", "Settings"],
      ],
    },
  ] as const;

  return (
    <aside className="sidebar">
      <div className="brand-row">
        <Icon name="spark" size={24} className="brand-mark" />
        <span>Acme Inc.</span>
        <button className="sidebar-toggle" aria-label="Collapse sidebar"><Icon name="card" size={15} /></button>
      </div>
      <label className="search-box">
        <Icon name="search" size={17} />
        <input aria-label="Search" placeholder="Search" />
        <kbd>⌘P</kbd>
      </label>
      <nav className="nav-groups" aria-label="Primary navigation">
        {groups.map((group) => (
          <div className="nav-group" key={group.title}>
            <button className="nav-group-title">
              {group.title}
              <Icon name="chevron" size={15} />
            </button>
            {group.items.map(([icon, label, badge]) => (
              <a className={`nav-item ${label === "Dashboard" ? "active" : ""}`} href="#" key={label}>
                <Icon name={icon as IconName} size={17} />
                <span>{label}</span>
                {badge && <span className="badge">{badge}</span>}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <motion.section whileHover={{ y: -2 }} className="upgrade-card">
          <Icon name="spark" size={30} />
          <h2>Upgrade Now</h2>
          <p>You have 100 credits left. Upgrade now to continue</p>
          <button>Upgrade now</button>
        </motion.section>
        <section className="profile-card" aria-label="User profile">
          <div className="avatar">
            <svg viewBox="0 0 42 42" aria-hidden="true">
              <circle cx="21" cy="21" r="20" fill="#2C8CFF" />
              <circle cx="21" cy="21" r="17" fill="#E9F2FF" />
              <path d="M13 30c1.4-5.1 14.6-5.1 16 0" fill="#1B1B1D" />
              <path d="M14 18c.8-5.2 4.8-8.2 10.3-7.3 3.8.7 5.6 3.9 4.6 8.2-.9 4.3-3.8 7.2-8.1 6.7-4.8-.4-7.5-3-6.8-7.6Z" fill="#fff" />
              <path d="M14.2 17.8c3.8.1 7.4-1.2 10.3-4.2 1.2 3.2 2.7 4.4 5 4.8-.6-4.9-3.5-7.7-8.7-7.7-4.1 0-6.4 2.3-6.6 7.1Z" fill="#16181A" />
              <circle cx="19" cy="19.3" r="1" fill="#16181A" />
              <circle cx="25.2" cy="19.3" r="1" fill="#16181A" />
            </svg>
          </div>
          <div className="profile-copy">
            <strong>Rico</strong>
            <span>hello@acedesign...</span>
          </div>
          <button aria-label="Profile settings"><Icon name="chevron" size={16} /></button>
        </section>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="top-header">
      <h1>Dashboard</h1>
      <div className="header-actions">
        <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="btn btn-dark">
          <Icon name="download" size={15} />
          Export
        </motion.button>
        <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="btn btn-light">
          <Icon name="share" size={15} />
          Share
        </motion.button>
        <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="icon-btn" aria-label="More actions">
          <Icon name="more" size={18} />
        </motion.button>
      </div>
    </header>
  );
}

function SummaryCard({ icon, label, value, delta, deltaTone, color, data, muted }: { icon: IconName; label: string; value: string; delta: string; deltaTone: "up" | "down"; color: string; data: number[]; muted: number }) {
  return (
    <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="summary-card">
      <div className="summary-top">
        <Icon name={icon} size={16} />
        <span>{label}</span>
      </div>
      <div className="summary-inner">
        <div className="summary-body">
          <strong>{value}</strong>
          <p><span className={deltaTone}>{delta}</span> vs last month</p>
        </div>
        <D3MiniBars data={data} color={color} muted={muted} />
      </div>
    </motion.section>
  );
}

function UsageSection() {
  return (
    <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel usage-panel">
      <div className="panel-header">
        <div className="section-title"><Icon name="category" size={17} />Usage Category</div>
        <div className="header-pills">
          <button>Yearly <Icon name="chevron" size={15} /></button>
          <button aria-label="Usage menu"><Icon name="more" size={16} /></button>
        </div>
      </div>
      <div className="usage-value">
        <strong>$15,200</strong>
        <span>total transactions</span>
      </div>
      <D3UsageChart />
    </motion.section>
  );
}

function TransactionTable() {
  const rows = [
    { brand: "paypal" as const, name: "Paypal Withdraw", date: "Oct 12, 2025", category: "Withdraw", amount: "$1,450" },
    { brand: "youtube" as const, name: "Youtube Premium", date: "Oct 12, 2025", category: "Subscription", amount: "$12" },
    { brand: "zapier" as const, name: "Zapier API", date: "Oct 12, 2025", category: "Subscription", amount: "$22" },
  ];

  return (
    <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel transaction-panel">
      <div className="panel-header table-title-row">
        <div className="section-title"><Icon name="transactions" size={17} />Transaction History</div>
        <button className="date-filter"><Icon name="calendar" size={15} />Nov 12 2025 - Dec 12 2025 <Icon name="chevron" size={15} /></button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th><span className="checkbox" /></th>
              <th>Name</th>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td><span className="checkbox" /></td>
                <td><span className="brand-cell"><BrandIcon brand={row.brand} />{row.name}</span></td>
                <td>{row.date}</td>
                <td><span className="pill">{row.category}</span></td>
                <td>{row.amount}</td>
                <td><button className="eye-btn" aria-label={`View ${row.name}`}><Icon name="eye" size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

function CreditCardWidget() {
  return (
    <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel right-panel card-widget">
      <div className="panel-header">
        <div className="section-title"><Icon name="card" size={17} />Available Cards</div>
        <button className="plain-action"><Icon name="plus" size={16} />Add Card</button>
      </div>
      <div className="metal-card" aria-label="Visa business card">
        <div className="metal-noise" />
        <VisaLogo />
        <div className="chip-wrap"><Icon name="chip" size={39} /><Icon name="contactless" size={28} /></div>
        <MastercardMark />
      </div>
      <div className="metric-list">
        <div><span><Icon name="loader" size={18} />Connected Card</span><strong>8 Accounts</strong></div>
        <div><span><Icon name="loader" size={18} />Total Balance</span><strong>$227,200</strong></div>
        <div><span><Icon name="loader" size={18} />Total Saving</span><strong>$35,610</strong></div>
      </div>
      <div className="action-stack">
        <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="request-button"><Icon name="request" size={16} />Request</motion.button>
        <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="send-button"><Icon name="send" size={16} />Send</motion.button>
      </div>
    </motion.section>
  );
}

function SavingsWidget() {
  const breakdown = [
    ["Investment", "$14,800", "#1EA7FF"],
    ["Holiday", "$8,450", "#3B8CFF"],
    ["New Home", "$7,200", "#21C7E8"],
    ["New Car", "$5,160", "#35D985"],
  ] as const;

  return (
    <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel right-panel savings-widget">
      <div className="panel-header">
        <div className="section-title"><Icon name="budget" size={17} />Budget saving</div>
        <button className="plain-action"><Icon name="plus" size={16} />New</button>
      </div>
      <div className="saving-value-row">
        <div>
          <span>Total Saving</span>
          <strong>$35,610</strong>
        </div>
        <div className="saving-growth">
          <strong>+12,3%</strong>
          <span>from last month</span>
        </div>
      </div>
      <D3SavingsBars />
      <div className="breakdown">
        {breakdown.map(([label, value, color]) => (
          <div key={label}>
            <span><i style={{ color }}><Icon name="loader" size={18} /></i>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function MainContent() {
  const cards = useMemo(
    () => [
      { icon: "card" as IconName, label: "Total Balance", value: "$8,800", delta: "+3.1%", deltaTone: "up" as const, color: "#1EA7FF", data: miniData.balance, muted: 13 },
      { icon: "arrowDown" as IconName, label: "Income", value: "$12,600", delta: "+2.1%", deltaTone: "up" as const, color: "#6C63FF", data: miniData.income, muted: 13 },
      { icon: "arrowUp" as IconName, label: "Expense", value: "$12,600", delta: "-3.2%", deltaTone: "down" as const, color: "#FF7A1A", data: miniData.expense, muted: 8 },
    ],
    [],
  );

  return (
    <main className="main-content">
      <div className="content-scroll">
        <div className="summary-grid">
          {cards.map((card) => <SummaryCard key={card.label} {...card} />)}
        </div>
        <UsageSection />
        <TransactionTable />
      </div>
    </main>
  );
}

function RightSidebar() {
  return (
    <aside className="right-sidebar">
      <CreditCardWidget />
      <SavingsWidget />
    </aside>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <Header />
      <MainContent />
      <RightSidebar />
    </div>
  );
}
