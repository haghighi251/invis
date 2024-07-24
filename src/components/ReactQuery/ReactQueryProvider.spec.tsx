import React from 'react';
import { render, screen } from '@testing-library/react';
import ReactQueryProvider from './ReactQueryProvider';

describe('ReactQueryProvider', () => {
  it('should render children', () => {
    render(
      <ReactQueryProvider>
        <div>Test Child</div>
      </ReactQueryProvider>
    );
    
    expect(screen.getByText('Test Child')).toBeDefined();
  });
});
