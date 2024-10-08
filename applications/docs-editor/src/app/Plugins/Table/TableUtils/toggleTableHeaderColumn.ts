import type { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { isCellHeaderRow } from './isCellHeaderRow'
import { isCellHeaderColumn } from './isCellHeaderColumn'
import { calculateHeaderCellState } from './calculateHeaderCellState'

export function $toggleTableHeaderColumn(tableNode: TableNode) {
  const table = tableNode.getLatest()
  const rows = table.getChildren<TableRowNode>()
  for (const row of rows) {
    const cell = row.getFirstChild<TableCellNode>()
    if (!cell) {
      return
    }
    const isHeaderRow = isCellHeaderRow(cell)
    const isHeaderColumn = isCellHeaderColumn(cell)
    if (isHeaderRow && isHeaderColumn) {
      cell.setHeaderStyles(calculateHeaderCellState(true, false))
      continue
    }
    cell.setHeaderStyles(calculateHeaderCellState(isHeaderRow, !isHeaderColumn))
  }
}
