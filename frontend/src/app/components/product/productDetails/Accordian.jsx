import React, { useState } from "react";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

const Accordian = ({ question, answer, index, expanded, handleChange }) => {
  return (
    <Accordion
      expanded={expanded === index}
      onChange={handleChange(index)}
      className="rounded-[10px] accordian_main_class"
    >
      <AccordionSummary
        aria-controls={`panel${index}-content`}
        id={`panel${index}-header`}
        className=" h-[70px]"
      >
        <div className="flex w-full justify-between items-center p-5 cursor-pointer">
          <p className="font-semibold text-[22px] leading-[26.66px] text-white">
            {question}
          </p>
          <div>
            {expanded === index ? (
              <IoMdRemove className="text-white w-[35px] h-[35px]" />
            ) : (
              <IoMdAdd className="text-white w-[35px] h-[35px]" />
            )}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails className="text-white text-start">
        {answer}
      </AccordionDetails>
    </Accordion>
  );
};

export default Accordian;
