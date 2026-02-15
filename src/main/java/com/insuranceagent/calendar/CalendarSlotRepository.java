package com.insuranceagent.calendar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CalendarSlotRepository extends JpaRepository<CalendarSlot, UUID> {

    List<CalendarSlot> findByAgentId(String agentId);

    List<CalendarSlot> findByBookedFalseAndStartTimeAfter(LocalDateTime after);

    List<CalendarSlot> findByAgentIdAndStartTimeBetween(String agentId, LocalDateTime start, LocalDateTime end);
}
