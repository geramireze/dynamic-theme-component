'use client';

import { useState } from 'react';
import Button from '@/components/Button/Button';
import DatePicker from '@/components/DatePicker/DatePicker';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDate2, setSelectedDate2] = useState<Date | null>(new Date());
  const [selectedDate3, setSelectedDate3] = useState<Date | null>(null);
  const [selectedDate4, setSelectedDate4] = useState<Date | null>(new Date());
  const [selectedDate5, setSelectedDate5] = useState<Date | null>(null);

  return (
    <main style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Multi-Bank Theming System
        </h1>
        <p style={{ color: '#666' }}>
          Current Theme: <strong>{process.env.NEXT_PUBLIC_THEME}</strong>
        </p>
        <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Each bank can have completely different component implementations with automatic build-time resolution.
        </p>
      </div>

      {/* DatePicker Examples */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          DatePicker Component - Input States Demo
        </h2>

        <div style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Interactive States Showcase
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6 }}>
            Each DatePicker input demonstrates different interactive states using theme-specific variables.
            Try hovering, clicking, and interacting with each input to see the state transitions.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>
              1. Default State (Empty)
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>
              Hover over the input to see hover styles. Click to see focus state.
            </p>
            <DatePicker
              label="Select a date"
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Choose a date..."
            />
            {selectedDate && (
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
                Selected: {selectedDate.toLocaleDateString()}
              </p>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>
              2. Filled State (Active)
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>
              Input with a value. Notice the filled state styling.
            </p>
            <DatePicker
              label="Appointment Date"
              value={selectedDate2}
              onChange={setSelectedDate2}
              helperText="Select your preferred appointment date"
            />
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>
              3. Error State
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>
              Shows error border, background, and error message.
            </p>
            <DatePicker
              label="Required Date"
              value={selectedDate3}
              onChange={setSelectedDate3}
              error="This field is required"
              placeholder="Please select a date"
            />
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>
              4. Disabled State
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>
              Input cannot be interacted with. Grayed out appearance.
            </p>
            <DatePicker
              label="Disabled Field"
              value={new Date()}
              onChange={(date) => console.log('Date changed:', date)}
              disabled
              helperText="This field is read-only"
            />
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>
              5. Focus State
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>
              Click the input to see focus ring and shadow effects.
            </p>
            <DatePicker
              label="Click to Focus"
              value={selectedDate4}
              onChange={setSelectedDate4}
              placeholder="Click to see focus state"
              helperText="Notice the border color and box shadow change"
            />
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>
              6. Hover State
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>
              Hover over this input to see the hover transition.
            </p>
            <DatePicker
              label="Hover Test"
              value={selectedDate5}
              onChange={setSelectedDate5}
              placeholder="Hover over me"
              helperText="Border and background colors change on hover"
            />
          </div>
        </div>
      </section>

      {/* Button Examples */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          Button Component
        </h2>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#666' }}>
            Button Variants
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#666' }}>
            Button Sizes
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#666' }}>
            Button States
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button onClick={() => alert('Clicked!')}>Clickable</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
