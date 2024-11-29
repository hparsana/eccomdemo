"use client";
import React, { useState } from "react";
import Accordian from "./Accordian";

const QuestionsLine = () => {
  const [expanded, setExpanded] = useState(false);

  const questions = [
    {
      question: "Does The One foam mattress sleep hot.?",
      answer:
        "The One foam mattress is designed to regulate temperature, ensuring a comfortable sleep experience.",
    },
    {
      question: "What materials are used in The One foam mattress?",
      answer:
        "The One foam mattress uses high-quality memory foam and support layers.",
    },
    {
      question: "How long does the mattress last?",
      answer:
        "With proper care, The One foam mattress can last for many years.",
    },
    {
      question: "Is there a warranty?",
      answer: "Yes, The One foam mattress comes with a 10-year warranty.",
    },
    {
      question: "Can I return the mattress if I don't like it?",
      answer: "Yes, there is a 100-night trial period for returns.",
    },
  ];

  const handleChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  return (
    <div className="w-full bg-[#EAE8E2] h-auto">
      <div className="container mx-auto">
        <div className="text-center py-[100px]">
          <h1 className="font-libre-franklin font-extrabold text-[44px] leading-[53.33px] text-[#171717]">
            Frequently Asked Questions
          </h1>
          <div className="mt-[60px]">
            {questions.map((item, index) => (
              <div
                key={index}
                className="w-[1028px] mx-auto mt-5 rounded-[10px] bg-[#7B6E62]"
              >
                <Accordian
                  index={index}
                  question={item.question}
                  answer={item.answer}
                  expanded={expanded}
                  handleChange={handleChange}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsLine;
