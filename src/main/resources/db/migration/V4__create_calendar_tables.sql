CREATE TABLE calendar_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    booked BOOLEAN NOT NULL DEFAULT FALSE,
    lead_id UUID REFERENCES leads(id),
    title VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_calendar_slots_agent_id ON calendar_slots(agent_id);
CREATE INDEX idx_calendar_slots_start_time ON calendar_slots(start_time);
CREATE INDEX idx_calendar_slots_booked ON calendar_slots(booked);
