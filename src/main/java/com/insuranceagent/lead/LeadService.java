package com.insuranceagent.lead;

import com.insuranceagent.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadNoteRepository leadNoteRepository;
    private final LeadMapper leadMapper;

    public LeadService(LeadRepository leadRepository,
                       LeadNoteRepository leadNoteRepository,
                       LeadMapper leadMapper) {
        this.leadRepository = leadRepository;
        this.leadNoteRepository = leadNoteRepository;
        this.leadMapper = leadMapper;
    }

    @Transactional
    public LeadResponse createLead(LeadCreateRequest request) {
        Lead lead = leadMapper.toEntity(request);
        Lead saved = leadRepository.save(lead);
        return leadMapper.toResponse(saved);
    }

    public List<LeadResponse> getAllLeads() {
        List<Lead> leads = leadRepository.findAll();
        return leadMapper.toResponseList(leads);
    }

    public LeadResponse getLeadById(UUID id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id));
        return leadMapper.toResponse(lead);
    }

    @Transactional
    public LeadResponse updateLead(UUID id, LeadUpdateRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id));

        if (request.firstName() != null) {
            lead.setFirstName(request.firstName());
        }
        if (request.lastName() != null) {
            lead.setLastName(request.lastName());
        }
        if (request.email() != null) {
            lead.setEmail(request.email());
        }
        if (request.phone() != null) {
            lead.setPhone(request.phone());
        }
        if (request.status() != null) {
            lead.setStatus(request.status());
        }
        if (request.source() != null) {
            lead.setSource(request.source());
        }
        if (request.assignedAgent() != null) {
            lead.setAssignedAgent(request.assignedAgent());
        }
        if (request.notes() != null) {
            lead.setNotes(request.notes());
        }

        Lead saved = leadRepository.save(lead);
        return leadMapper.toResponse(saved);
    }

    @Transactional
    public void deleteLead(UUID id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id));
        leadRepository.delete(lead);
    }

    public List<LeadResponse> getLeadsByStatus(LeadStatus status) {
        List<Lead> leads = leadRepository.findByStatus(status);
        return leadMapper.toResponseList(leads);
    }

    @Transactional
    public LeadNoteResponse addNote(UUID leadId, LeadNoteCreateRequest request) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", leadId));

        LeadNote note = new LeadNote();
        note.setLead(lead);
        note.setContent(request.content());
        note.setAuthor(request.author());

        LeadNote saved = leadNoteRepository.save(note);
        return leadMapper.toNoteResponse(saved);
    }

    public List<LeadNoteResponse> getNotes(UUID leadId) {
        List<LeadNote> notes = leadNoteRepository.findByLeadIdOrderByCreatedAtDesc(leadId);
        return leadMapper.toNoteResponseList(notes);
    }
}
