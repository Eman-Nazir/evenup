import PDFDocument from 'pdfkit';
import Expense from '../models/Expense.model.js';
import Settlement from '../models/Settlement.model.js';
import Group from '../models/Group.model.js';
import AppError from '../utils/AppError.js';

export const generateGroupLedgerPdf = async (userId, groupId, res) => {
  const group = await Group.findById(groupId).populate('members.user', 'name');
  if (!group) throw new AppError('Group not found', 404);

  const isMember = group.members.some((m) => m.user._id.equals(userId));
  if (!isMember) throw new AppError('You are not a member of this group', 403);

  const [expenses, settlements] = await Promise.all([
    Expense.find({ group: groupId }).populate('paidBy.user', 'name').sort({ date: 1 }),
    Settlement.find({ group: groupId }).populate('from to', 'name').sort({ settledAt: 1 }),
  ]);

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${group.name}-ledger.pdf"`);
  doc.pipe(res);

  doc.fontSize(20).text(`${group.name} — Expense Ledger`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).fillColor('#64748b').text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(2);

  doc.fontSize(14).fillColor('#000').text('Expenses');
  doc.moveDown(0.5);
  expenses.forEach((e) => {
    doc.fontSize(10).text(
      `${new Date(e.date).toLocaleDateString()}  —  ${e.description}  —  PKR ${e.amount}  —  paid by ${e.paidBy[0]?.user?.name || 'N/A'}`
    );
  });

  doc.moveDown();
  doc.fontSize(14).text('Settlements');
  doc.moveDown(0.5);
  settlements.forEach((s) => {
    doc.fontSize(10).text(
      `${new Date(s.settledAt).toLocaleDateString()}  —  ${s.from.name} paid ${s.to.name}  —  PKR ${s.amount}`
    );
  });

  doc.end();
};