package com.insuranceagent.calendar;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CalendarSlotMapper {

    @Mapping(source = "lead.id", target = "leadId")
    CalendarSlotResponse toResponse(CalendarSlot calendarSlot);

    List<CalendarSlotResponse> toResponseList(List<CalendarSlot> calendarSlots);
}
