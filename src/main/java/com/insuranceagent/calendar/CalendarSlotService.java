package com.insuranceagent.calendar;

import com.insuranceagent.common.ResourceNotFoundException;
import com.insuranceagent.lead.Lead;
import com.insuranceagent.lead.LeadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CalendarSlotService {

    private final CalendarSlotRepository calendarSlotRepository;
    private final CalendarSlotMapper calendarSlotMapper;
    private final LeadRepository leadRepository;

    public CalendarSlotService(CalendarSlotRepository calendarSlotRepository,
                               CalendarSlotMapper calendarSlotMapper,
                               LeadRepository leadRepository) {
        this.calendarSlotRepository = calendarSlotRepository;
        this.calendarSlotMapper = calendarSlotMapper;
        this.leadRepository = leadRepository;
    }

    @Transactional
    public CalendarSlotResponse createSlot(CalendarSlotCreateRequest request) {
        CalendarSlot slot = new CalendarSlot();
        slot.setAgentId(request.agentId());
        slot.setStartTime(request.startTime());
        slot.setEndTime(request.endTime());
        slot.setTitle(request.title());
        slot.setNotes(request.notes());

        CalendarSlot saved = calendarSlotRepository.save(slot);
        return calendarSlotMapper.toResponse(saved);
    }

    public List<CalendarSlotResponse> getAllSlots() {
        List<CalendarSlot> slots = calendarSlotRepository.findAll();
        return calendarSlotMapper.toResponseList(slots);
    }

    public CalendarSlotResponse getSlotById(UUID id) {
        CalendarSlot slot = calendarSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CalendarSlot", id));
        return calendarSlotMapper.toResponse(slot);
    }

    @Transactional
    public CalendarSlotResponse updateSlot(UUID id, CalendarSlotUpdateRequest request) {
        CalendarSlot slot = calendarSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CalendarSlot", id));

        if (request.agentId() != null) {
            slot.setAgentId(request.agentId());
        }
        if (request.startTime() != null) {
            slot.setStartTime(request.startTime());
        }
        if (request.endTime() != null) {
            slot.setEndTime(request.endTime());
        }
        if (request.booked() != null) {
            slot.setBooked(request.booked());
        }
        if (request.leadId() != null) {
            Lead lead = leadRepository.findById(request.leadId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lead", request.leadId()));
            slot.setLead(lead);
        }
        if (request.title() != null) {
            slot.setTitle(request.title());
        }
        if (request.notes() != null) {
            slot.setNotes(request.notes());
        }

        CalendarSlot saved = calendarSlotRepository.save(slot);
        return calendarSlotMapper.toResponse(saved);
    }

    @Transactional
    public void deleteSlot(UUID id) {
        CalendarSlot slot = calendarSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CalendarSlot", id));
        calendarSlotRepository.delete(slot);
    }

    public List<CalendarSlotResponse> getAvailableSlots() {
        List<CalendarSlot> slots = calendarSlotRepository.findByBookedFalseAndStartTimeAfter(LocalDateTime.now());
        return calendarSlotMapper.toResponseList(slots);
    }
}
