import { useEffect, useMemo, useRef, useState } from "react";
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
  | "sidebarPanel"
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

type UsageFilter = "Monthly" | "Quarterly" | "Yearly";
type UsageDatum = { month: string; value: number; marker?: string };
type PageKey = "Dashboard" | "Wallet" | "Cards" | "Transactions" | "Budget" | "Goals" | "Analytics" | "Cash Flow" | "Investments" | "Help Center" | "Settings";

const usageSeries: Record<UsageFilter, UsageDatum[]> = {
  Monthly: [
    { month: "W1", value: 12840 },
    { month: "W2", value: 17120 },
    { month: "W3", value: 21860 },
    { month: "W4", value: 28712, marker: "active" },
  ],
  Quarterly: [
    { month: "Q1", value: 19100 },
    { month: "Q2", value: 28712, marker: "active" },
    { month: "Q3", value: 25800 },
    { month: "Q4", value: 28600 },
  ],
  Yearly: usageData.map((d) => ({ ...d, marker: d.month === "Jun" ? "active" : undefined })),
};

const savingsData = [28, 33, 39, 45, 50, 56, 63, 70, 76, 82, 88, 94, 90, 84, 79, 72, 66, 62, 58, 55, 52, 49, 46, 43, 40, 37, 35, 32, 30, 28, 25, 23, 21, 19, 17, 15];
const walletFlowData = [35, 49, 43, 61, 56, 73, 69, 82, 75, 88, 80, 94, 86, 78, 91, 85, 98, 92];

const usageHeadline: Record<UsageFilter, string> = {
  Monthly: "$15,200",
  Quarterly: "$18,740",
  Yearly: "$15,200",
};

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
    dashboard: <><path d="M4.7 11.2 12 5.4l7.3 5.8v5.55a3 3 0 0 1-3 3H7.7a3 3 0 0 1-3-3V11.2Z" /><path d="M9.4 15.3h5.2" /></>,
    wallet: <><rect x="4" y="6.5" width="16" height="13" rx="3.2" /><path d="M7 6.5V5.2c0-.9.7-1.6 1.6-1.6H17" /><path d="M15.7 12.7h4.3" /><path d="M8 10h4.1" /></>,
    card: <><rect x="3.8" y="7" width="16.4" height="10.5" rx="2.7" /><path d="M3.8 10.5h16.4" /><path d="M7.1 14.3h3" /></>,
    transactions: <><rect x="6.1" y="4.7" width="12.8" height="15" rx="3" /><path d="M3.8 8.6h4.4M3.8 12h4.4M3.8 15.4h4.4" /><path d="M10.6 9h5.2M10.6 12h4.2" /></>,
    budget: <><path d="M6.2 14.4c-1.4-.2-2.4-1.2-2.4-2.6 0-1.3 1.1-2.4 2.5-2.5.7-2.3 2.8-3.8 5.3-3.8 2 0 3.7 1 4.7 2.6h1.2c1.5 0 2.8 1.2 2.8 2.7 0 1.6-1.3 2.8-2.9 2.8h-.8" /><path d="M9 16.2h6.2" /><path d="M10.6 18.9h3" /><path d="M17.2 4.4v3.1M18.8 5.9h-3.2" /></>,
    goals: <><path d="M4.2 19.4h15.6" /><path d="M6.2 17v-4.6" /><path d="M10.1 17V9.8" /><path d="M14 17v-9.5" /><path d="M17.9 17V5.4" /><path d="m5.4 10.5 4.3-3.4 3.9 2.5 5.1-5.1" /></>,
    analytics: <><path d="M12 3.8v8.3h8.3" /><path d="M20.2 13.3a8.2 8.2 0 1 1-9.5-9.5" /><path d="M12 12.1 6.2 17.9" /></>,
    cash: <><path d="M6 6.1h8.5a4.1 4.1 0 0 1 0 8.2H6a2.5 2.5 0 0 1 0-5h9.2" /><path d="M7 17.9h8.6a3.8 3.8 0 0 0 3.6-2.6" /><path d="M8 4v16M11.8 4v16" /></>,
    invest: <><path d="M4 19h16" /><path d="M6.2 15.5v-1.4M9.6 15.5v-4.2M13 15.5V8.2M16.4 15.5V6.1" /><path d="M19 4.8v1.6" /></>,
    help: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.3" /><path d="M12 3.5v5.2M12 15.3v5.2M3.5 12h5.2M15.3 12h5.2" /></>,
    settings: <><circle cx="12" cy="12" r="3.2" /><path d="M20.1 13.5v-3l-2.1-.5a6.8 6.8 0 0 0-.7-1.6l1.1-1.8-2.1-2.1-1.8 1.1c-.5-.3-1-.5-1.6-.7L12.5 3h-3l-.5 2.1c-.6.2-1.1.4-1.6.7L5.6 4.7 3.5 6.8l1.1 1.8c-.3.5-.5 1-.7 1.6l-2 .5v3l2 .5c.2.6.4 1.1.7 1.6l-1.1 1.8 2.1 2.1 1.8-1.1c.5.3 1 .5 1.6.7l.5 2.1h3l.5-2.1c.6-.2 1.1-.4 1.6-.7l1.8 1.1 2.1-2.1-1.1-1.8c.3-.5.5-1 .7-1.6l2-.5Z" /></>,
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
    sidebarPanel: <><rect x="4" y="4.5" width="16" height="15" rx="4" /><path d="M14.5 4.5v15" /><path d="M17.2 8h.01M17.2 11h.01" /></>,
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

function D3UsageChart({ data, activeLabel }: { data: UsageDatum[]; activeLabel: string }) {
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

    let currentActiveLabel = activeLabel;
    const activeDatum = data.find((d) => d.month === currentActiveLabel) ?? data[Math.max(0, data.length - 1)];
    const maxValue = Math.max(30000, d3.max(data, (d) => d.value) ?? 30000);
    const x = d3.scaleBand().domain(data.map((d) => d.month)).range([0, chartWidth]).paddingInner(data.length > 4 ? 0.3 : 0.48).paddingOuter(data.length > 4 ? 0.03 : 0.24);
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

    const tooltip = root.append("g").attr("class", "chart-tooltip").attr("opacity", 1).style("pointer-events", "none");
    tooltip.append("rect").attr("width", 72).attr("height", 29).attr("x", -36).attr("y", -50).attr("rx", 8).attr("fill", "#1D1D1F").attr("filter", "drop-shadow(0 7px 13px rgba(0,0,0,.2))");
    tooltip.append("path").attr("d", "M-6 -21 0 -13 6 -21Z").attr("fill", "#1D1D1F");
    tooltip.append("text").attr("x", 0).attr("y", -31).attr("text-anchor", "middle").attr("fill", "#fff").attr("font-size", 12).attr("font-weight", 750);

    const barLayer = root
      .append("g")
      .attr("class", "usage-bars");

    barLayer
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => (x(d.month) ?? 0) + ((x.bandwidth() - 40) / 2))
      .attr("y", chartHeight)
      .attr("width", 40)
      .attr("height", 0)
      .attr("rx", 12)
      .attr("fill", (d) => (d.month === activeLabel ? "url(#activeBarGradient)" : "url(#inactiveBarGradient)"))
      .transition()
      .duration(650)
      .delay((_, index) => index * 34)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => chartHeight - y(d.value));

    const bars = barLayer.selectAll<SVGRectElement, UsageDatum>("rect");
    const setTooltip = (datum: UsageDatum, visible = true) => {
      const cx = (x(datum.month) ?? 0) + x.bandwidth() / 2;
      tooltip.attr("transform", `translate(${cx},${y(datum.value)})`);
      tooltip.select("text").text(`$${datum.value.toLocaleString("en-US")}`);
      tooltip.interrupt().transition().duration(220).ease(d3.easeCubicOut).attr("opacity", visible ? 1 : 0);
    };
    const setActive = (month: string) => {
      currentActiveLabel = month;
      bars
        .transition()
        .duration(220)
        .ease(d3.easeCubicOut)
        .attr("fill", (d) => (d.month === currentActiveLabel ? "url(#activeBarGradient)" : "url(#inactiveBarGradient)"));
      root
        .selectAll<SVGTextElement, UsageDatum>(".usage-x-label")
        .transition()
        .duration(220)
        .ease(d3.easeCubicOut)
        .attr("font-weight", (d) => (d.month === currentActiveLabel ? 700 : 500))
        .attr("fill", (d) => (d.month === currentActiveLabel ? "#1D1D1F" : "#B5B5BA"));
    };
    if (activeDatum) setTooltip(activeDatum);

    bars
      .on("mouseenter", function (_, datum) {
        const hoverValue = Math.min(maxValue, datum.value + 1150);
        setActive(datum.month);
        d3.select(this)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("y", y(hoverValue))
          .attr("height", chartHeight - y(hoverValue))
          .attr("fill", "url(#activeBarGradient)");
        setTooltip(datum);
      })
      .on("mouseleave", function (_, datum) {
        d3.select(this)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("y", y(datum.value))
          .attr("height", chartHeight - y(datum.value))
          .attr("fill", datum.month === currentActiveLabel ? "url(#activeBarGradient)" : "url(#inactiveBarGradient)");
        setTooltip(datum);
      });

    root
      .append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("class", "usage-x-label")
      .attr("x", (d) => (x(d.month) ?? 0) + x.bandwidth() / 2)
      .attr("y", chartHeight + 25)
      .attr("text-anchor", "middle")
      .attr("font-size", 13)
      .attr("font-weight", (d) => (d.month === activeLabel ? 700 : 500))
      .attr("fill", (d) => (d.month === activeLabel ? "#1D1D1F" : "#B5B5BA"))
      .text((d) => d.month);
  }, [activeLabel, data]);

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

function Sidebar({ activePage, onNavigate }: { activePage: PageKey; onNavigate: (page: PageKey) => void }) {
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
        <button className="sidebar-toggle" aria-label="Collapse sidebar"><Icon name="sidebarPanel" size={19} /></button>
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
            {group.items.map(([icon, label, badge]) => {
              const isPage = ["Dashboard", "Wallet", "Cards", "Transactions", "Budget", "Goals", "Analytics", "Cash Flow", "Investments", "Help Center", "Settings"].includes(label);
              return (
              <a
                className={`nav-item ${label === activePage ? "active" : ""}`}
                href="#"
                key={label}
                onClick={(event) => {
                  if (!isPage) return;
                  event.preventDefault();
                  onNavigate(label as PageKey);
                }}
              >
                <Icon name={icon as IconName} size={17} />
                <span>{label}</span>
                {badge && <span className="badge">{badge}</span>}
              </a>
              );
            })}
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
            <img src="/assets/rico-avatar.png" alt="" />
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

function Header({ title }: { title: PageKey }) {
  return (
    <header className="top-header">
      <h1>{title}</h1>
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
  const [filter, setFilter] = useState<UsageFilter>("Yearly");
  const [isOpen, setIsOpen] = useState(false);
  const chartData = usageSeries[filter];
  const activeLabel = chartData.find((d) => d.marker === "active")?.month ?? chartData[chartData.length - 1].month;
  return (
    <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel usage-panel">
      <div className="panel-header">
        <div className="section-title"><Icon name="category" size={17} />Usage Category</div>
        <div className="header-pills">
          <div className="filter-control">
            <button aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>{filter} <Icon name="chevron" size={15} /></button>
            {isOpen && (
              <div className="filter-menu" role="menu">
                {(["Yearly", "Quarterly", "Monthly"] as const).map((option) => (
                  <button
                    className={option === filter ? "selected" : ""}
                    key={option}
                    onClick={() => {
                      setFilter(option);
                      setIsOpen(false);
                    }}
                    role="menuitem"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button aria-label="Usage menu"><Icon name="more" size={16} /></button>
        </div>
      </div>
      <div className="usage-value">
        <strong>{usageHeadline[filter]}</strong>
        <span>total transactions</span>
      </div>
      <D3UsageChart data={chartData} activeLabel={activeLabel} />
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
      <div className="right-card-body card-body">
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
      <div className="right-card-body savings-body">
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
      </div>
    </motion.section>
  );
}

function D3WalletFlowChart() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 604;
    const height = 164;
    const margin = { top: 14, right: 12, bottom: 18, left: 12 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const x = d3.scaleLinear().domain([0, walletFlowData.length - 1]).range([0, chartWidth]);
    const y = d3.scaleLinear().domain([20, 105]).range([chartHeight, 0]);

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "none");

    const defs = svg.append("defs");
    const areaGradient = defs.append("linearGradient").attr("id", "walletAreaGradient").attr("x1", "0").attr("y1", "0").attr("x2", "0").attr("y2", "1");
    areaGradient.append("stop").attr("offset", "0%").attr("stop-color", "#1EA7FF").attr("stop-opacity", 0.22);
    areaGradient.append("stop").attr("offset", "100%").attr("stop-color", "#1EA7FF").attr("stop-opacity", 0);

    const root = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const area = d3.area<number>()
      .x((_, index) => x(index))
      .y0(chartHeight)
      .y1((value) => y(value))
      .curve(d3.curveMonotoneX);
    const line = d3.line<number>()
      .x((_, index) => x(index))
      .y((value) => y(value))
      .curve(d3.curveMonotoneX);

    root
      .append("path")
      .datum(walletFlowData)
      .attr("d", area)
      .attr("fill", "url(#walletAreaGradient)");

    root
      .append("path")
      .datum(walletFlowData)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#1EA7FF")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round");

    root
      .selectAll("circle")
      .data(walletFlowData.filter((_, index) => index % 4 === 1))
      .join("circle")
      .attr("cx", (value) => x(walletFlowData.indexOf(value)))
      .attr("cy", (value) => y(value))
      .attr("r", 4)
      .attr("fill", "#fff")
      .attr("stroke", "#1EA7FF")
      .attr("stroke-width", 2);
  }, []);

  return <svg ref={ref} className="wallet-flow-chart" aria-label="Wallet cash movement chart" role="img" />;
}

function WalletSummaryCard({ icon, label, value, caption, tone }: { icon: IconName; label: string; value: string; caption: string; tone?: "up" | "down" }) {
  return (
    <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="wallet-summary-card">
      <div className="summary-top">
        <Icon name={icon} size={16} />
        <span>{label}</span>
      </div>
      <div className="wallet-summary-inner">
        <strong>{value}</strong>
        <span className={tone ?? ""}>{caption}</span>
      </div>
    </motion.section>
  );
}

function WalletOverview() {
  return (
    <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel wallet-overview">
      <div className="panel-header">
        <div className="section-title"><Icon name="wallet" size={17} />Wallet Overview</div>
        <button className="date-filter"><Icon name="calendar" size={15} />Jun 2026 <Icon name="chevron" size={15} /></button>
      </div>
      <div className="wallet-overview-grid">
        <div className="wallet-balance-card">
          <span>Available Balance</span>
          <strong>$42,860</strong>
          <p><b>+8.4%</b> since last month</p>
          <div className="wallet-actions">
            <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="send-button"><Icon name="plus" size={15} />Add Money</motion.button>
            <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="request-button"><Icon name="send" size={15} />Transfer</motion.button>
          </div>
        </div>
        <div className="wallet-flow-card">
          <div className="wallet-flow-head">
            <span>Cash Movement</span>
            <strong>$18,240 inflow</strong>
          </div>
          <D3WalletFlowChart />
        </div>
      </div>
    </motion.section>
  );
}

function WalletAccountsTable() {
  const rows = [
    { name: "Operating Wallet", type: "Primary", balance: "$22,420", status: "Active" },
    { name: "Payroll Wallet", type: "Team", balance: "$8,950", status: "Scheduled" },
    { name: "Tax Reserve", type: "Reserve", balance: "$7,200", status: "Locked" },
    { name: "Marketing Spend", type: "Virtual", balance: "$4,290", status: "Active" },
  ];

  return (
    <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel wallet-table-panel">
      <div className="panel-header table-title-row">
        <div className="section-title"><Icon name="wallet" size={17} />Wallet Accounts</div>
        <button className="plain-action"><Icon name="plus" size={16} />New Wallet</button>
      </div>
      <div className="table-wrap wallet-table">
        <table>
          <thead>
            <tr>
              <th><span className="checkbox" /></th>
              <th>Wallet</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td><span className="checkbox" /></td>
                <td><span className="wallet-name"><Icon name="wallet" size={17} />{row.name}</span></td>
                <td>{row.type}</td>
                <td>{row.balance}</td>
                <td><span className="pill">{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

function WalletActivity() {
  const rows = [
    ["Stripe payout", "+$6,420", "Today, 10:24 AM", "#1EA7FF"],
    ["AWS billing", "-$840", "Yesterday, 04:12 PM", "#FF7A1A"],
    ["Team reimbursement", "-$312", "Jun 14, 2026", "#6C63FF"],
    ["Reserve transfer", "+$2,100", "Jun 12, 2026", "#35D985"],
  ] as const;

  return (
    <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel wallet-activity-panel">
      <div className="panel-header">
        <div className="section-title"><Icon name="transactions" size={17} />Recent Wallet Activity</div>
      </div>
      <div className="wallet-activity-list">
        {rows.map(([label, amount, date, color]) => (
          <div className="wallet-activity-row" key={label}>
            <i style={{ color }}><Icon name="loader" size={18} /></i>
            <div>
              <strong>{label}</strong>
              <span>{date}</span>
            </div>
            <b>{amount}</b>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function D3DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const width = 170;
    const height = 170;
    const radius = Math.min(width, height) / 2;
    const pie = d3.pie<{ label: string; value: number; color: string }>().value((d) => d.value).sort(null);
    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>().innerRadius(radius - 24).outerRadius(radius - 4).cornerRadius(8);

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "xMidYMid meet");
    const root = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
    root
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("opacity", 0.94)
      .on("mouseenter", function () {
        d3.select(this).transition().duration(260).ease(d3.easeCubicOut).attr("transform", "scale(1.035)");
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(260).ease(d3.easeCubicOut).attr("transform", "scale(1)");
      });
    root.append("circle").attr("r", radius - 32).attr("fill", "#fff");
  }, [data]);

  return <svg ref={ref} className="donut-chart" aria-label="Allocation chart" role="img" />;
}

function PageMetric({ icon, label, value, meta, color = "#1EA7FF" }: { icon: IconName; label: string; value: string; meta: string; color?: string }) {
  return (
    <motion.div whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="page-metric">
      <span style={{ color }}><Icon name={icon} size={17} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{meta}</small>
      </div>
    </motion.div>
  );
}

function WalletContent() {
  const accounts = [
    ["Operating Wallet", "Primary settlement", "$22,420", "+$6,420", "#1EA7FF"],
    ["Payroll Wallet", "Next run Jun 28", "$8,950", "-$12,600", "#6C63FF"],
    ["Tax Reserve", "Auto sweep enabled", "$7,200", "+$2,100", "#21C7E8"],
    ["Marketing Spend", "Card funded", "$4,290", "-$840", "#35D985"],
    ["Vendor Escrow", "Awaiting approval", "$3,180", "-$4,800", "#FF7A1A"],
  ] as const;
  const rails = [
    ["ACH", "Same-day enabled", "$84,200"],
    ["Wire", "2 pending review", "$31,450"],
    ["Card funding", "Daily sweep", "$18,760"],
    ["Reserve rules", "4 active rules", "$12,900"],
  ] as const;
  const queue = [
    ["Vendor ACH", "Scheduled today at 2:30 PM", "$4,800"],
    ["Payroll batch", "Runs Jun 28 after approval", "$12,600"],
    ["Tax reserve sweep", "Auto rule from Operating Wallet", "$2,100"],
    ["Marketing top-up", "Triggered below $5,000", "$3,200"],
  ] as const;

  return (
    <main className="main-content">
      <div className="content-scroll page-scroll">
        <section className="page-grid wallet-page-grid">
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel wallet-balance-hub">
            <div className="panel-header">
              <div className="section-title"><Icon name="wallet" size={17} />Wallet Command Center</div>
              <button className="date-filter"><Icon name="calendar" size={15} />June 2026 <Icon name="chevron" size={15} /></button>
            </div>
            <div className="wallet-balance-content">
              <div>
                <span>Total available liquidity</span>
                <strong>$42,860</strong>
                <p><b>+$8,240</b> net cash movement this month</p>
              </div>
              <div className="wallet-action-row">
                <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="send-button"><Icon name="plus" size={15} />Add Money</motion.button>
                <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="request-button"><Icon name="send" size={15} />Transfer</motion.button>
              </div>
            </div>
            <div className="wallet-flow-card embedded-flow-card">
              <div className="wallet-flow-head">
                <span>Cash Movement</span>
                <strong>$18,240 inflow</strong>
              </div>
              <D3WalletFlowChart />
            </div>
          </motion.section>

          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel wallet-rail-panel">
            <div className="panel-header">
              <div className="section-title"><Icon name="cash" size={17} />Money Rails</div>
              <button className="plain-action"><Icon name="plus" size={16} />Connect</button>
            </div>
            <div className="rail-chart-block">
              <D3DonutChart data={[
                { label: "ACH", value: 48, color: "#1EA7FF" },
                { label: "Wire", value: 22, color: "#6C63FF" },
                { label: "Cards", value: 18, color: "#21C7E8" },
                { label: "Reserve", value: 12, color: "#35D985" },
              ]} />
              <div>
                <strong>92%</strong>
                <span>automated routing</span>
              </div>
            </div>
            <div className="rail-grid">
              {rails.map(([label, meta, value]) => (
                <div className="rail-card" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <p>{meta}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </section>

        <section className="page-grid wallet-detail-grid">
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel wallet-accounts-panel">
            <div className="panel-header">
              <div className="section-title"><Icon name="wallet" size={17} />Wallet Accounts</div>
              <button className="plain-action"><Icon name="plus" size={16} />New Pocket</button>
            </div>
            <div className="account-stack">
              {accounts.map(([label, meta, value, delta, color]) => (
                <div className="account-row" key={label}>
                  <i style={{ color }}><Icon name="loader" size={18} /></i>
                  <div>
                    <strong>{label}</strong>
                    <span>{meta}</span>
                  </div>
                  <b>{value}</b>
                  <em className={delta.startsWith("+") ? "positive" : "negative"}>{delta}</em>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel wallet-queue-panel">
            <div className="panel-header">
              <div className="section-title"><Icon name="transactions" size={17} />Transfer Queue</div>
              <button className="date-filter">Next 7 days <Icon name="chevron" size={15} /></button>
            </div>
            <div className="queue-stack">
              {queue.map(([label, meta, amount]) => (
                <div className="queue-row" key={label}>
                  <span><Icon name="send" size={17} /></span>
                  <div>
                    <strong>{label}</strong>
                    <small>{meta}</small>
                  </div>
                  <b>{amount}</b>
                </div>
              ))}
            </div>
          </motion.section>
        </section>
      </div>
    </main>
  );
}

function CardsContent() {
  const cards = [
    { name: "Executive Visa", owner: "Rico Lee", type: "Physical", spend: "$18,400", limit: "$24,000", status: "Active", last4: "8842", tone: "#1EA7FF", rules: "Travel, software, meals" },
    { name: "Marketing Virtual", owner: "Growth Team", type: "Virtual", spend: "$7,800", limit: "$12,000", status: "Active", last4: "1028", tone: "#6C63FF", rules: "Ads, media, SaaS" },
    { name: "Travel Card", owner: "Operations", type: "Physical", spend: "$4,600", limit: "$9,500", status: "Frozen", last4: "4510", tone: "#21C7E8", rules: "Flights and lodging" },
    { name: "Vendor Card", owner: "Finance", type: "Virtual", spend: "$12,240", limit: "$18,000", status: "Review", last4: "6704", tone: "#FF7A1A", rules: "Procurement only" },
    { name: "Product Research", owner: "Product", type: "Virtual", spend: "$2,180", limit: "$6,000", status: "Active", last4: "2197", tone: "#35D985", rules: "Tools and testing" },
    { name: "Events Card", owner: "Sales", type: "Virtual", spend: "$5,920", limit: "$11,000", status: "Active", last4: "7340", tone: "#1EA7FF", rules: "Events and field spend" },
    { name: "Contractor Card", owner: "People", type: "Virtual", spend: "$3,420", limit: "$8,000", status: "Paused", last4: "5489", tone: "#6C63FF", rules: "Contractor equipment" },
  ];
  const requests = [
    ["Mia Chen", "Temporary travel limit", "$2,500", "Approve"],
    ["Growth Team", "Increase ad spend", "$6,000", "Review"],
    ["Finance", "Vendor single-use card", "$9,200", "Issue"],
  ] as const;
  const [selectedCard, setSelectedCard] = useState(cards[0]);

  return (
    <main className="main-content">
      <div className="content-scroll page-scroll">
        <section className="cards-page-grid">
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel card-inventory-panel">
            <div className="panel-header">
              <div className="section-title"><Icon name="card" size={17} />Card Inventory</div>
              <div className="header-pills">
                <button>All cards <Icon name="chevron" size={15} /></button>
                <button><Icon name="plus" size={15} />Issue</button>
              </div>
            </div>
            <div className="inventory-toolbar">
              <span>12 active</span>
              <span>4 virtual</span>
              <span>2 need review</span>
            </div>
            <div className="card-inventory-list">
              {cards.map((card) => (
                <button className={`inventory-card-row ${card.name === selectedCard.name ? "selected" : ""}`} key={card.name} onClick={() => setSelectedCard(card)}>
                  <i style={{ color: card.tone }}><Icon name="card" size={18} /></i>
                  <div>
                    <strong>{card.name}</strong>
                    <span>{card.owner} / {card.type} / **** {card.last4}</span>
                  </div>
                  <b>{card.spend}</b>
                  <em>{card.status}</em>
                </button>
              ))}
            </div>
          </motion.section>

          <div className="cards-side-stack">
            <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel selected-card-panel rich-card-detail">
              <div className="panel-header">
                <div className="section-title"><Icon name="card" size={17} />Selected Card</div>
                <button className="date-filter">{selectedCard.status} <Icon name="chevron" size={15} /></button>
              </div>
              <div className="selected-card-grid">
                <div className="metal-card card-page-preview" aria-label={`${selectedCard.name} card`}>
                  <div className="metal-noise" />
                  <VisaLogo />
                  <div className="chip-wrap"><Icon name="chip" size={39} /><Icon name="contactless" size={28} /></div>
                  <MastercardMark />
                </div>
                <div className="selected-card-stats">
                  <div><span>Owner</span><strong>{selectedCard.owner}</strong></div>
                  <div><span>Spend</span><strong>{selectedCard.spend}</strong></div>
                  <div><span>Limit</span><strong>{selectedCard.limit}</strong></div>
                  <div><span>Rules</span><strong>{selectedCard.rules}</strong></div>
                </div>
              </div>
              <div className="card-spend-strip">
                <span>Spend velocity</span>
                <D3MiniBars data={miniData.expense} color={selectedCard.tone} muted={9} />
              </div>
            </motion.section>

            <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel card-request-panel">
              <div className="panel-header">
                <div className="section-title"><Icon name="transactions" size={17} />Card Requests</div>
                <button className="plain-action">View all</button>
              </div>
              <div className="request-stack">
                {requests.map(([person, title, amount, status]) => (
                  <div className="request-row" key={title}>
                    <div>
                      <strong>{person}</strong>
                      <span>{title}</span>
                    </div>
                    <b>{amount}</b>
                    <em>{status}</em>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </section>
      </div>
    </main>
  );
}

function TransactionsContent() {
  const rows = [
    { brand: "paypal" as const, name: "Enterprise client payout", account: "Operating Wallet", date: "Oct 12, 2025", category: "Income", amount: "$28,900", status: "Cleared" },
    { brand: "zapier" as const, name: "Quarterly automation suite", account: "Marketing Virtual", date: "Oct 12, 2025", category: "Expense", amount: "$9,840", status: "Review" },
    { brand: "paypal" as const, name: "Partner settlement", account: "Operating Wallet", date: "Oct 11, 2025", category: "Income", amount: "$18,420", status: "Cleared" },
    { brand: "youtube" as const, name: "Annual media contracts", account: "Executive Visa", date: "Oct 10, 2025", category: "Expense", amount: "$7,200", status: "Pending" },
    { brand: "zapier" as const, name: "Infrastructure workflow", account: "Vendor Card", date: "Oct 09, 2025", category: "Expense", amount: "$4,680", status: "Cleared" },
    { brand: "youtube" as const, name: "Creator studio program", account: "Marketing Virtual", date: "Oct 08, 2025", category: "Expense", amount: "$3,140", status: "Cleared" },
    { brand: "paypal" as const, name: "Annual software renewal", account: "Vendor Card", date: "Oct 07, 2025", category: "Expense", amount: "$11,600", status: "Review" },
    { brand: "zapier" as const, name: "Ops workflow expansion", account: "Operating Wallet", date: "Oct 06, 2025", category: "Expense", amount: "$2,880", status: "Cleared" },
  ];
  const [filter, setFilter] = useState("All");
  const visibleRows = filter === "All" ? rows : rows.filter((row) => row.category === filter || row.status === filter);
  const exportRows = () => {
    const header = ["Name", "Account", "Date", "Category", "Amount", "Status"];
    const csv = [header, ...visibleRows.map((row) => [row.name, row.account, row.date, row.category, row.amount, row.status])]
      .map((line) => line.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "acme-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="main-content">
      <div className="content-scroll page-scroll">
        <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel transaction-hero-panel">
          <div>
            <span>Large Transactions</span>
            <strong>$86,660</strong>
            <p>8 high-value events across wallets, cards, and vendor rails</p>
          </div>
          <div className="transaction-command-actions">
            <button className="btn btn-light"><Icon name="calendar" size={15} />Oct 2025</button>
            <button className="btn btn-dark" onClick={exportRows}><Icon name="download" size={15} />Export CSV</button>
          </div>
          <div className="transaction-hero-chart">
            <D3MiniBars data={miniData.income} color="#1EA7FF" muted={7} />
          </div>
        </motion.section>

        <section className="transaction-page-grid">
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel transaction-list-panel">
            <div className="panel-header">
              <div className="section-title"><Icon name="transactions" size={17} />Transaction Review</div>
              <div className="header-pills">
                <button>Amount high-low <Icon name="chevron" size={15} /></button>
                <button onClick={exportRows}>Export <Icon name="download" size={15} /></button>
              </div>
            </div>
            <div className="transaction-filter-row">
              {["All", "Income", "Expense", "Review", "Pending"].map((item) => <button className={item === filter ? "selected" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}
            </div>
            <div className="big-transaction-list">
              {visibleRows.map((row) => (
                <div className="big-transaction-row" key={`${row.name}-${row.date}`}>
                  <BrandIcon brand={row.brand} />
                  <div>
                    <strong>{row.name}</strong>
                    <span>{row.account} / {row.date}</span>
                  </div>
                  <em>{row.category}</em>
                  <b>{row.amount}</b>
                  <i>{row.status}</i>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel reconciliation-panel">
            <div className="panel-header">
              <div className="section-title"><Icon name="settings" size={17} />Reconciliation</div>
            </div>
            <div className="recon-stack">
              {[
                ["Needs receipt", "3 transactions", "$24,640"],
                ["Awaiting approval", "2 reviewers", "$16,800"],
                ["Policy matched", "92% auto-cleared", "$62,020"],
                ["Export ready", "CSV and audit log", "8 rows"],
              ].map(([label, meta, value]) => (
                <div className="recon-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <p>{meta}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </section>

        <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel ledger-panel transaction-ledger-panel">
          <div className="panel-header table-title-row">
            <div className="section-title"><Icon name="transactions" size={17} />Audit Ledger</div>
            <button className="date-filter">Filtered rows: {visibleRows.length}</button>
          </div>
          <div className="table-wrap ledger-table">
            <table>
              <thead>
                <tr>
                  <th><span className="checkbox" /></th>
                  <th>Name</th>
                  <th>Account</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={`${row.name}-${row.date}`}>
                    <td><span className="checkbox" /></td>
                    <td><span className="brand-cell"><BrandIcon brand={row.brand} />{row.name}</span></td>
                    <td>{row.account}</td>
                    <td>{row.date}</td>
                    <td><span className="pill">{row.category}</span></td>
                    <td>{row.amount}</td>
                    <td><span className="pill">{row.status}</span></td>
                    <td><button className="eye-btn" aria-label={`View ${row.name}`}><Icon name="eye" size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function BudgetContent() {
  const cards = [
    { icon: "budget" as IconName, label: "Budget Used", value: "$68,420", caption: "72% of plan" },
    { icon: "cash" as IconName, label: "Remaining", value: "$26,580", caption: "+$4,200 buffer", tone: "up" as const },
    { icon: "goals" as IconName, label: "Savings Goal", value: "$35,610", caption: "+12.3% month" },
  ];
  const categories = [
    ["Operations", "$18,400", "76%", "#1EA7FF"],
    ["Marketing", "$14,800", "62%", "#6C63FF"],
    ["Payroll", "$24,600", "81%", "#21C7E8"],
    ["Travel", "$5,160", "43%", "#35D985"],
    ["Software", "$9,440", "67%", "#FF7A1A"],
    ["Contractors", "$6,720", "58%", "#6C63FF"],
  ] as const;

  return (
    <main className="main-content">
      <div className="content-scroll product-scroll">
        <div className="wallet-summary-grid">
          {cards.map((card) => <WalletSummaryCard key={card.label} {...card} />)}
        </div>
        <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel budget-plan-panel expanded-budget-panel">
          <div className="panel-header">
            <div className="section-title"><Icon name="budget" size={17} />Budget Plan</div>
            <button className="plain-action"><Icon name="plus" size={16} />New Plan</button>
          </div>
          <div className="budget-grid">
            <div className="budget-total-card">
              <span>Monthly Budget</span>
              <strong>$95,000</strong>
              <p><b>$26,580</b> still available</p>
              <D3SavingsBars />
            </div>
            <div className="budget-category-list">
              {categories.map(([label, value, percent, color]) => (
                <div className="budget-category-row" key={label}>
                  <div>
                    <span><i style={{ color }}><Icon name="loader" size={18} /></i>{label}</span>
                    <strong>{value}</strong>
                  </div>
                  <div className="budget-track"><em style={{ width: percent, background: color }} /></div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
        <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel product-table-panel">
          <div className="panel-header table-title-row">
            <div className="section-title"><Icon name="goals" size={17} />Budget Rules</div>
            <button className="date-filter">Active Rules <Icon name="chevron" size={15} /></button>
          </div>
          <div className="budget-rules-grid">
            {["Alert at 80% usage", "Auto-reserve tax savings", "Freeze travel above limit", "Require approval over $2,500"].map((rule) => (
              <div className="control-tile" key={rule}>
                <span>{rule}</span>
                <strong>Enabled</strong>
              </div>
            ))}
          </div>
        </motion.section>
        <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel budget-forecast-panel">
          <div className="panel-header">
            <div className="section-title"><Icon name="analytics" size={17} />Forecast</div>
            <button className="date-filter">Next 30 days <Icon name="chevron" size={15} /></button>
          </div>
          <div className="forecast-grid">
            {[
              ["Expected spend", "$31,400", "Based on recurring vendors"],
              ["Projected overage", "$0", "All categories within range"],
              ["Safe to allocate", "$8,200", "Can move to savings"],
            ].map(([label, value, meta]) => (
              <div className="rail-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <p>{meta}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function GoalsContent() {
  const goals = [
    ["Emergency reserve", "$48,000", "78%", "#1EA7FF"],
    ["New office buildout", "$32,400", "54%", "#6C63FF"],
    ["Tax buffer", "$21,800", "86%", "#21C7E8"],
    ["Hiring plan", "$18,200", "41%", "#35D985"],
  ] as const;

  return (
    <main className="main-content">
      <div className="content-scroll page-scroll">
        <div className="page-metric-grid">
          <PageMetric icon="goals" label="Goal Balance" value="$120,400" meta="+$8,600 this month" />
          <PageMetric icon="budget" label="On Track" value="7 goals" meta="2 need attention" color="#6C63FF" />
          <PageMetric icon="cash" label="Auto Funding" value="$4,200" meta="weekly allocation" color="#35D985" />
        </div>
        <section className="page-grid goals-grid">
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel goal-progress-panel">
            <div className="panel-header">
              <div className="section-title"><Icon name="goals" size={17} />Goal Progress</div>
              <button className="plain-action"><Icon name="plus" size={16} />New Goal</button>
            </div>
            <div className="budget-category-list">
              {goals.map(([label, value, percent, color]) => (
                <div className="budget-category-row" key={label}>
                  <div><span><i style={{ color }}><Icon name="loader" size={18} /></i>{label}</span><strong>{value}</strong></div>
                  <div className="budget-track"><em style={{ width: percent, background: color }} /></div>
                </div>
              ))}
            </div>
          </motion.section>
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel allocation-panel">
            <div className="panel-header"><div className="section-title"><Icon name="analytics" size={17} />Allocation</div></div>
            <D3DonutChart data={[
              { label: "Reserve", value: 38, color: "#1EA7FF" },
              { label: "Office", value: 26, color: "#6C63FF" },
              { label: "Tax", value: 22, color: "#21C7E8" },
              { label: "Hiring", value: 14, color: "#35D985" },
            ]} />
            <div className="mini-legend">
              {goals.map(([label, , , color]) => <span key={label}><i style={{ background: color }} />{label}</span>)}
            </div>
          </motion.section>
        </section>
      </div>
    </main>
  );
}

function AnalyticsContent() {
  return (
    <main className="main-content">
      <div className="content-scroll page-scroll">
        <div className="page-metric-grid">
          <PageMetric icon="analytics" label="Net Revenue" value="$227,200" meta="+12.8% vs prior period" />
          <PageMetric icon="transactions" label="Transaction Count" value="1,284" meta="94% auto-categorized" color="#6C63FF" />
          <PageMetric icon="cash" label="Cash Efficiency" value="82%" meta="+6 pts improved" color="#35D985" />
        </div>
        <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel analytics-overview-panel">
          <div className="panel-header">
            <div className="section-title"><Icon name="analytics" size={17} />Performance Overview</div>
            <button className="date-filter">Last 12 months <Icon name="chevron" size={15} /></button>
          </div>
          <div className="analytics-grid">
            <div className="analytics-chart-card"><D3WalletFlowChart /></div>
            <div className="analytics-breakout">
              {[
                ["Revenue retained", "$184,600", "#1EA7FF"],
                ["Spend optimized", "$42,800", "#6C63FF"],
                ["Savings captured", "$35,610", "#35D985"],
              ].map(([label, value, color]) => <div className="rail-card" key={label}><span>{label}</span><strong>{value}</strong><p style={{ color }}>above monthly plan</p></div>)}
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function CashFlowContent() {
  const schedule = [
    ["Stripe payout", "Expected tomorrow", "+$18,200"],
    ["Payroll", "Jun 28", "-$24,600"],
    ["AWS billing", "Jun 30", "-$4,800"],
    ["Tax reserve", "Jul 01", "-$7,200"],
  ] as const;

  return (
    <main className="main-content">
      <div className="content-scroll page-scroll">
        <div className="page-metric-grid">
          <PageMetric icon="cash" label="Projected Cash" value="$68,240" meta="30-day runway" />
          <PageMetric icon="arrowDown" label="Expected Inflow" value="$42,600" meta="next 14 days" color="#35D985" />
          <PageMetric icon="arrowUp" label="Committed Outflow" value="$36,100" meta="scheduled payments" color="#FF7A1A" />
        </div>
        <section className="transaction-page-grid">
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel cashflow-panel">
            <div className="panel-header"><div className="section-title"><Icon name="cash" size={17} />Cash Flow Curve</div></div>
            <D3WalletFlowChart />
            <div className="card-spend-strip"><span>Daily movement</span><D3MiniBars data={miniData.balance} color="#1EA7FF" muted={6} /></div>
          </motion.section>
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel transfer-queue-panel">
            <div className="panel-header"><div className="section-title"><Icon name="calendar" size={17} />Upcoming</div></div>
            <div className="queue-stack">
              {schedule.map(([label, meta, amount]) => <div className="queue-row" key={label}><span><Icon name={amount.startsWith("+") ? "arrowDown" : "arrowUp"} size={17} /></span><div><strong>{label}</strong><small>{meta}</small></div><b>{amount}</b></div>)}
            </div>
          </motion.section>
        </section>
      </div>
    </main>
  );
}

function InvestmentsContent() {
  const holdings = [
    ["Treasury Bills", "$62,400", "46%", "#1EA7FF"],
    ["Money Market", "$38,200", "28%", "#6C63FF"],
    ["Index Funds", "$21,600", "16%", "#21C7E8"],
    ["Cash Reserve", "$13,800", "10%", "#35D985"],
  ] as const;

  return (
    <main className="main-content">
      <div className="content-scroll page-scroll">
        <div className="page-metric-grid">
          <PageMetric icon="invest" label="Portfolio Value" value="$136,000" meta="+4.6% YTD" />
          <PageMetric icon="cash" label="Yield" value="5.1%" meta="blended annualized" color="#35D985" />
          <PageMetric icon="analytics" label="Risk Level" value="Low" meta="treasury weighted" color="#6C63FF" />
        </div>
        <section className="page-grid goals-grid">
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel goal-progress-panel">
            <div className="panel-header"><div className="section-title"><Icon name="invest" size={17} />Holdings</div><button className="plain-action"><Icon name="plus" size={16} />Buy</button></div>
            <div className="budget-category-list">
              {holdings.map(([label, value, percent, color]) => <div className="budget-category-row" key={label}><div><span><i style={{ color }}><Icon name="loader" size={18} /></i>{label}</span><strong>{value}</strong></div><div className="budget-track"><em style={{ width: percent, background: color }} /></div></div>)}
            </div>
          </motion.section>
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel allocation-panel">
            <div className="panel-header"><div className="section-title"><Icon name="analytics" size={17} />Mix</div></div>
            <D3DonutChart data={holdings.map(([label, , percent, color]) => ({ label, value: Number.parseInt(percent, 10), color }))} />
            <div className="card-spend-strip"><span>Yield trend</span><D3MiniBars data={miniData.income} color="#35D985" muted={5} /></div>
          </motion.section>
        </section>
      </div>
    </main>
  );
}

function HelpCenterContent() {
  const tickets = [
    ["Card dispute", "Waiting on merchant evidence", "Open"],
    ["ACH limit request", "Finance team reviewing", "In review"],
    ["New admin setup", "Provisioning complete", "Solved"],
  ] as const;

  return (
    <main className="main-content">
      <div className="content-scroll page-scroll">
        <section className="help-hero-grid">
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel support-hero-panel">
            <div className="section-title"><Icon name="help" size={17} />How can we help?</div>
            <label className="search-box support-search"><Icon name="search" size={17} /><input aria-label="Search help" placeholder="Search cards, wallets, exports..." /></label>
            <div className="support-topic-grid">
              {["Cards", "Wallets", "Transactions", "Security"].map((topic) => <button className="control-tile" key={topic}><span>{topic}</span><strong>Browse</strong></button>)}
            </div>
          </motion.section>
          <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel transfer-queue-panel">
            <div className="panel-header"><div className="section-title"><Icon name="transactions" size={17} />Support Tickets</div></div>
            <div className="queue-stack">{tickets.map(([title, meta, status]) => <div className="queue-row" key={title}><span><Icon name="help" size={17} /></span><div><strong>{title}</strong><small>{meta}</small></div><b>{status}</b></div>)}</div>
          </motion.section>
        </section>
      </div>
    </main>
  );
}

function SettingsContent() {
  return (
    <main className="main-content">
      <div className="content-scroll page-scroll">
        <div className="page-metric-grid">
          <PageMetric icon="settings" label="Workspace" value="Acme Inc." meta="Business plan" />
          <PageMetric icon="help" label="Security Score" value="96%" meta="2FA enforced" color="#35D985" />
          <PageMetric icon="cash" label="Billing" value="$249/mo" meta="renews Jul 12" color="#6C63FF" />
        </div>
        <section className="settings-grid">
          {[
            ["Company Profile", "Legal name, address, tax profile", "Updated"],
            ["Team Access", "18 members, 4 admins", "Review"],
            ["Approval Rules", "7 active spend policies", "Edit"],
            ["Integrations", "Slack, QuickBooks, Google", "Manage"],
            ["Security", "SSO, 2FA, device sessions", "Strong"],
            ["Notifications", "Email and Slack routing", "Enabled"],
          ].map(([title, meta, status]) => (
            <motion.section whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,.05)" }} className="panel setting-tile" key={title}>
              <Icon name="settings" size={18} />
              <div><strong>{title}</strong><span>{meta}</span></div>
              <button className="plain-action">{status}</button>
            </motion.section>
          ))}
        </section>
      </div>
    </main>
  );
}

function DashboardContent() {
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
  const [activePage, setActivePage] = useState<PageKey>("Dashboard");
  const contentByPage: Record<PageKey, ReactNode> = {
    Dashboard: <DashboardContent />,
    Wallet: <WalletContent />,
    Cards: <CardsContent />,
    Transactions: <TransactionsContent />,
    Budget: <BudgetContent />,
    Goals: <GoalsContent />,
    Analytics: <AnalyticsContent />,
    "Cash Flow": <CashFlowContent />,
    Investments: <InvestmentsContent />,
    "Help Center": <HelpCenterContent />,
    Settings: <SettingsContent />,
  };

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <Header title={activePage} />
      {contentByPage[activePage]}
      <RightSidebar />
    </div>
  );
}
