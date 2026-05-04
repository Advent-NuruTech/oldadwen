import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const events = [
  {
    title: "GENERAL SESSION MEETING",
    startDate: "2025-12-31",
    endDate: "2026-01-02",
    venue: "KATITO",
    participants: "ALL CHURCHES",
  },
  {
    title: "COUNSELS ON STEWARDSHIP SABBATH",
    startDate: "2026-01-17",
    endDate: "2026-01-17",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "PROPHECY SABBATH",
    startDate: "2026-01-24",
    endDate: "2026-01-24",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "EXECUTIVE MEETING",
    startDate: "2026-01-31",
    endDate: "2026-01-31",
    venue: "RONGO",
    participants: "EXECUTIVE MEMBERS",
  },
  {
    title: "SEMINAR",
    startDate: "2026-02-02",
    endDate: "2026-02-05",
    venue: "ADEK KABUOCH",
    participants: "ELDERS, DEACONS, DORCAS, CLERKS, TREASURERS, GOSPEL MINISTERS",
  },
  {
    title: "HOMABAY MISSION",
    startDate: "2026-02-08",
    endDate: "2026-02-21",
    venue: "HOMABAY",
    participants: "ALL CHURCHES",
  },
  {
    title: "TRUE EDUCATION SABBATH",
    startDate: "2026-02-28",
    endDate: "2026-02-28",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "REVIVAL WEEK OF PRAYER",
    startDate: "2026-03-13",
    endDate: "2026-03-20",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "CHILDREN SABBATH",
    startDate: "2026-04-04",
    endDate: "2026-04-04",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "CONVENTION",
    startDate: "2026-04-10",
    endDate: "2026-04-25",
    venue: "SIAYA",
    participants: "ALL YOUNG EVANGELISTS",
  },
  {
    title: "EXECUTIVE COUNCIL COMMITTEE MEETING",
    startDate: "2026-04-29",
    endDate: "2026-04-29",
    venue: "RONGO",
    participants: "ALL DEPARTMENTAL HEADS",
  },
  {
    title: "HEALTH SABBATH",
    startDate: "2026-06-06",
    endDate: "2026-06-06",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "ARAM / NDIRA / BONDO MISSION",
    startDate: "2026-06-12",
    endDate: "2026-06-27",
    venue: "BONDO / ARAM / NDIRA",
    participants: "ALL CHURCHES",
  },
  {
    title: "RELIGIOUS LIBERTY SABBATH",
    startDate: "2026-07-04",
    endDate: "2026-07-04",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "EXECUTIVE COUNCIL COMMITTEE MEETING",
    startDate: "2026-07-15",
    endDate: "2026-07-15",
    venue: "RONGO",
    participants: "ALL DEPARTMENTAL HEADS",
  },
  {
    title: "KAPSABET MISSION",
    startDate: "2026-07-17",
    endDate: "2026-08-01",
    venue: "KAPSABET",
    participants: "ALL CHURCHES",
  },
  {
    title: "CAMP MEETING",
    startDate: "2026-08-07",
    endDate: "2026-08-22",
    venue: "OPAPO",
    participants: "RANEN, RONGO, THIDHNA, KADEL",
  },
  {
    title: "MUSIC / PUBLISHING SABBATH",
    startDate: "2026-08-29",
    endDate: "2026-08-29",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "RAPOGI / URIRI MISSION",
    startDate: "2026-09-11",
    endDate: "2026-09-25",
    venue: "RAPOGI / URIRI",
    participants: "ALL CHURCHES",
  },
  {
    title: "EXECUTIVE COUNCIL COMMITTEE MEETING",
    startDate: "2026-10-07",
    endDate: "2026-10-07",
    venue: "RONGO",
    participants: "ALL DEPARTMENTAL HEADS",
  },
  {
    title: "STEWARDSHIP SABBATH",
    startDate: "2026-10-10",
    endDate: "2026-10-10",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "CAMP MEETING",
    startDate: "2026-10-16",
    endDate: "2026-10-31",
    venue: "SIGOMRE",
    participants: "SIAYA / NANDI / KISUMU CHURCHES",
  },
  {
    title: "REVIVAL WEEK OF PRAYER",
    startDate: "2026-11-06",
    endDate: "2026-11-14",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "KISUMU MISSION",
    startDate: "2026-11-15",
    endDate: "2026-11-28",
    venue: "KISUMU",
    participants: "ALL CHURCHES",
  },
  {
    title: "CAMP MEETING",
    startDate: "2026-12-04",
    endDate: "2026-12-19",
    venue: "ADEK / MALELE / KOBODO / KIPASI",
    participants: "CHURCHES",
  },
  {
    title: "DORCAS SABBATH",
    startDate: "2026-12-26",
    endDate: "2026-12-26",
    venue: "ALL CHURCHES",
    participants: "ALL CHURCHES",
  },
  {
    title: "GENERAL SESSION",
    startDate: "2026-12-29",
    endDate: "2026-12-31",
    venue: "OPEN",
    participants: "ALL DELEGATES",
  },
];

const upload = async () => {
  for (const event of events) {
    await addDoc(collection(db, "events"), {
      ...event,
      createdAt: new Date(),
    });
    console.log("Uploaded:", event.title);
  }

  console.log("🔥 ALL EVENTS UPLOADED SUCCESSFULLY");
};

upload();